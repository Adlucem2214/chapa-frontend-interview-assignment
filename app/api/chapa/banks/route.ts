import { NextResponse } from 'next/server';

const MOCK_ETHIOPIAN_BANKS = [
  { id: '1', name: 'Commercial Bank of Ethiopia (CBE)', code: 'cbe' },
  { id: '2', name: 'Dashen Bank', code: 'dashen' },
  { id: '3', name: 'Awash Bank', code: 'awash' },
  { id: '4', name: 'Bank of Abyssinia', code: 'abyssinia' },
  { id: '5', name: 'Wegagen Bank', code: 'wegagen' },
  { id: '6', name: 'Nib International Bank', code: 'nib' },
  { id: '7', name: 'Cooperative Bank of Oromia (Coop)', code: 'coop' },
  { id: '8', name: 'Hibret Bank', code: 'hibret' },
  { id: '9', name: 'Zemen Bank', code: 'zemen' },
  { id: '10', name: 'Abay Bank', code: 'abay' },
];

export async function GET() {
  try {
    const secretKey = process.env.CHAPA_SECRET_KEY;

    if (!secretKey || secretKey === 'your_chapa_secret_key_here') {
      console.warn('CHAPA_SECRET_KEY missing or placeholder; returning mock banks list.');
      return NextResponse.json({
        success: true,
        data: MOCK_ETHIOPIAN_BANKS,
      });
    }

    let chapaResponse: Response;
    try {
      console.log('Calling Chapa API: GET /v1/banks');
      chapaResponse = await fetch('https://api.chapa.co/v1/banks', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${secretKey}` },
        signal: AbortSignal.timeout(8000),
      });
    } catch (networkErr: any) {
      console.warn(`Chapa banks unreachable (${networkErr.message}). Returning mock list.`);
      return NextResponse.json({ success: true, data: MOCK_ETHIOPIAN_BANKS });
    }

    const responseData = await chapaResponse.json();
    console.log('Chapa response status:', chapaResponse.status);
    // If unauthorized, keep behaviour of returning mock list for local dev safety
    if (chapaResponse.status === 401) {
      console.warn('Chapa returned 401 Unauthorized; returning mock banks list.');
      return NextResponse.json({
        success: true,
        data: MOCK_ETHIOPIAN_BANKS,
      });
    }

    if (!chapaResponse.ok) {
      return NextResponse.json(
        {
          success: false,
          error: responseData.message || 'Failed to fetch banks list from Chapa',
        },
        { status: chapaResponse.status }
      );
    }

    console.log('Returning banks from Chapa (count:', (responseData.data || responseData).length || 'unknown', ')');
    return NextResponse.json({
      success: true,
      data: responseData.data || responseData,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: err.message || 'Internal Server Error during banks lookup',
      },
      { status: 500 }
    );
  }
}
