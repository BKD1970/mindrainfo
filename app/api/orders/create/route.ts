import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      customer,
      cart,
      subtotal,
      gst,
      handlingCharge,
      totalAmount,
      currency,
      paymentId,
    } = body;

    // Basic validation
    if (!customer?.fullName || !customer?.email) {
      return NextResponse.json(
        {
          success: false,
          message: "Customer information is incomplete.",
        },
        { status: 400 }
      );
    }

    if (!Array.isArray(cart) || cart.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Cart is empty.",
        },
        { status: 400 }
      );
    }

    if (!paymentId) {
      return NextResponse.json(
        {
          success: false,
          message: "Payment ID is missing.",
        },
        { status: 400 }
      );
    }

    // Generate a readable MindraInfo order number
    const orderNumber = `MI-${Date.now()}`;

    const hasPhysicalProduct = cart.some(
      (item: { productType?: string | null }) =>
        item.productType?.toLowerCase() === "physical"
    );

    // Create the order
    const { data, error } = await supabaseAdmin
      .from("orders")
      .insert({
        order_number: orderNumber,

        customer_name: customer.fullName,
        customer_email: customer.email,
        customer_phone: customer.phone || null,

        shipping_address: hasPhysicalProduct
          ? customer.address || null
          : null,

        shipping_city: hasPhysicalProduct
          ? customer.city || null
          : null,

        shipping_state: hasPhysicalProduct
          ? customer.state || null
          : null,

        shipping_pincode: hasPhysicalProduct
          ? customer.pincode || null
          : null,

        items: cart,

        subtotal: subtotal ?? totalAmount,
        gst: gst ?? 0,
        handling_charge: handlingCharge ?? 0,
        total_amount: totalAmount,

        currency: currency || "INR",

        payment_id: paymentId,
        payment_method: "test",
        payment_status: "paid",

        order_status: "paid",
      })
      .select()
      .single();

    if (error) {
      console.error("ORDER CREATION ERROR:", error);

      return NextResponse.json(
        {
          success: false,
          message: "Unable to create order.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Order created successfully.",
      order: data,
    });
  } catch (error) {
    console.error("ORDER API ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while creating the order.",
      },
      { status: 500 }
    );
  }
}