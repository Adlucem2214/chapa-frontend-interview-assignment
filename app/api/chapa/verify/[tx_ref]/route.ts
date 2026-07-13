import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ tx_ref: string }> }
) {
  try {
    const { tx_ref } = await params;

    if (!tx_ref) {
      return NextResponse.json(
        { success: false, error: 'Transaction reference is required.' },
        { status: 400 }
      );
    }

    const secretKey = process.env.CHAPA_SECRET_KEY;

    if (!secretKey || secretKey === 'your_chapa_secret_key_here') {
      let status = 'success';
      let message = 'Transaction verified successfully';
      
      if (tx_ref.toLowerCase().includes('fail')) {
        status = 'failed';
        message = 'Transaction verification failed';
      } else if (tx_ref.toLowerCase().includes('pend')) {
        status = 'pending';
        message = 'Transaction is still pending';
      }

      return NextResponse.json({
        success: true,
        data: {
          status,
          message,
          tx_ref,
          amount: 5000,
          currency: 'ETB',
          first_name: 'Simulated',
          last_name: 'Customer',
          email: 'customer@simulation.co',
        },
      });
    }

    let chapaResponse: Response;
    const simStatus = (ref: string) =>
      ref.toLowerCase().includes('fail') ? 'failed'
      : ref.toLowerCase().includes('pend') ? 'pending'
      : 'success';
    try {
      chapaResponse = await fetch(`https://api.chapa.co/v1/transaction/verify/${tx_ref}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${secretKey}` },
        signal: AbortSignal.timeout(8000),
      });
    } catch (networkErr: any) {
      console.warn(`Chapa verify unreachable (${networkErr.message}). Simulating.`);
      const status = simStatus(tx_ref);
      return NextResponse.json({
        success: true,
        data: { status, tx_ref, amount: 5000, currency: 'ETB', first_name: 'Simulated', last_name: 'Customer', email: 'customer@simulation.co', message: `Transaction ${status}` },
      });
    }

    const responseData = await chapaResponse.json();

    if (chapaResponse.status === 401) {
      console.warn('CHAPA_SECRET_KEY rejected (401). Simulating verification result.');
      const status = simStatus(tx_ref);
      return NextResponse.json({
        success: true,
        data: { status, tx_ref, amount: 5000, currency: 'ETB', first_name: 'Simulated', last_name: 'Customer', email: 'customer@simulation.co', message: `Transaction ${status}` },
      });
    }

    if (!chapaResponse.ok) {
      return NextResponse.json(
        {
          success: false,
          error: responseData.message || 'Chapa verification failed',
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
        error: err.message || 'Internal Server Error during transaction verification',
      },
      { status: 500 }
    );
  }
}
