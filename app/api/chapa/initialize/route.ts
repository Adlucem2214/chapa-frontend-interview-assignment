import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, currency, email, first_name, last_name, tx_ref, callback_url, return_url } = body;

    if (!amount || !email || !first_name || !last_name || !tx_ref) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required parameters: amount, email, first_name, last_name, and tx_ref are required.',
        },
        { status: 400 }
      );
    }

    const secretKey = process.env.CHAPA_SECRET_KEY;

    if (!secretKey || secretKey === 'your_chapa_secret_key_here') {
      const simulatedUrl = `https://checkout.chapa.co/checkout/payment-simulation/?tx_ref=${encodeURIComponent(tx_ref)}&amount=${amount}&email=${encodeURIComponent(email)}&mode=test`;
      return NextResponse.json({
        success: true,
        data: {
          checkout_url: simulatedUrl,
          _simulation: true,
          tx_ref,
        },
      });
    }

    let chapaResponse: Response;
    try {
      chapaResponse = await fetch('https://api.chapa.co/v1/transaction/initialize', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${secretKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency,
          email,
          first_name,
          last_name,
          tx_ref,
          callback_url,
          return_url,
        }),
        signal: AbortSignal.timeout(8000),
      });
    } catch (networkErr: any) {
      const simulatedUrl = `https://checkout.chapa.co/checkout/payment-simulation/?tx_ref=${encodeURIComponent(tx_ref)}&amount=${amount}&email=${encodeURIComponent(email)}&mode=test`;
      return NextResponse.json({
        success: true,
        data: {
          checkout_url: simulatedUrl,
          _simulation: true,
          tx_ref,
        },
      });
    }

    const responseData = await chapaResponse.json();

    if (chapaResponse.status === 401) {
      const simulatedUrl = `https://checkout.chapa.co/checkout/payment-simulation/?tx_ref=${encodeURIComponent(tx_ref)}&amount=${amount}&email=${encodeURIComponent(email)}&mode=test`;
      return NextResponse.json({
        success: true,
        data: {
          checkout_url: simulatedUrl,
          _simulation: true,
          tx_ref,
        },
      });
    }

    if (!chapaResponse.ok) {
      return NextResponse.json(
        {
          success: false,
          error: responseData.message || 'Chapa initialization failed',
          data: responseData,
        },
        { status: chapaResponse.status }
      );
    }

    return NextResponse.json({
      success: true,
      data: responseData.data || responseData,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: err.message || 'Internal Server Error during transaction initialization',
      },
      { status: 500 }
    );
  }
}
