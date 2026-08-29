import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { amount, customer } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid payment amount.",
        },
        { status: 400 }
      );
    }

    if (!customer?.fullName || !customer?.email) {
      return NextResponse.json(
        {
          success: false,
          message: "Customer information is incomplete.",
        },
        { status: 400 }
      );
    }

    /*
      TEST PAYMENT ONLY

      No real money is processed here.
      This simulates a successful payment.
    */

    const testPaymentId = `TEST_${Date.now()}`;

    return NextResponse.json({
      success: true,
      paymentId: testPaymentId,
      amount,
      currency: "INR",
      status: "paid",
      mode: "test",
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Unable to process test payment.",
      },
      { status: 500 }
    );
  }
}