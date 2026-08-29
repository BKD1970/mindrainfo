import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { orderId, productId } = body;

    if (!orderId || !productId) {
      return NextResponse.json(
        {
          success: false,
          message: "Order ID and Product ID are required.",
        },
        { status: 400 }
      );
    }

    // Get the order
    const { data: order, error: orderError } =
      await supabaseAdmin
        .from("orders")
        .select("*")
        .eq("id", orderId)
        .single();

    if (orderError || !order) {
      return NextResponse.json(
        {
          success: false,
          message: "Order not found.",
        },
        { status: 404 }
      );
    }

    // Only paid orders can download
    if (order.payment_status !== "paid") {
      return NextResponse.json(
        {
          success: false,
          message: "This order has not been paid.",
        },
        { status: 403 }
      );
    }

    // Get product
    const { data: product, error: productError } =
      await supabaseAdmin
        .from("products")
        .select("id, name, product_type, digital_file_url")
        .eq("id", productId)
        .single();

    if (productError || !product) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found.",
        },
        { status: 404 }
      );
    }

    // Make sure the product is digital
    if (product.product_type !== "digital") {
      return NextResponse.json(
        {
          success: false,
          message: "This product is not a digital product.",
        },
        { status: 400 }
      );
    }

    // Make sure a digital file is attached
    if (!product.digital_file_url) {
      return NextResponse.json(
        {
          success: false,
          message: "No digital file is attached to this product.",
        },
        { status: 404 }
      );
    }

    // Create a temporary secure download URL
    const { data: signedUrl, error: signedUrlError } =
      await supabaseAdmin.storage
        .from("digital-products")
        .createSignedUrl(
          product.digital_file_url,
          300
        );

    if (signedUrlError || !signedUrl) {
      console.error(
        "SIGNED URL ERROR:",
        signedUrlError
      );

      return NextResponse.json(
        {
          success: false,
          message: "Unable to create download link.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      productName: product.name,
      downloadUrl: signedUrl.signedUrl,
      expiresIn: 300,
    });
  } catch (error) {
    console.error(
      "DOWNLOAD API ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong.",
      },
      { status: 500 }
    );
  }
}