import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const transactionId = searchParams.get('transactionId');
  const amount = searchParams.get('amount');

  // Return an HTML page that simulates the VodaPay payment page
  const html = `
<!DOCTYPE html>
<html>
<head>
    <title>VodaPay Sandbox - Test Payment</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #f3f4f6;
            margin: 0;
            padding: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }
        .container {
            max-width: 500px;
            width: 100%;
            background: white;
            border-radius: 16px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            padding: 32px;
        }
        .header {
            text-align: center;
            margin-bottom: 32px;
        }
        .logo {
            font-size: 48px;
            margin-bottom: 16px;
        }
        h1 {
            color: #1f2937;
            font-size: 24px;
            margin: 0 0 8px 0;
        }
        .amount {
            font-size: 32px;
            font-weight: bold;
            color: #059669;
            margin: 16px 0;
        }
        .card-input {
            margin-bottom: 16px;
        }
        label {
            display: block;
            font-size: 14px;
            font-weight: 500;
            color: #374151;
            margin-bottom: 4px;
        }
        input, select {
            width: 100%;
            padding: 10px;
            border: 1px solid #d1d5db;
            border-radius: 8px;
            font-size: 16px;
            box-sizing: border-box;
        }
        button {
            width: 100%;
            background: #059669;
            color: white;
            border: none;
            padding: 12px;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            margin-top: 16px;
        }
        button:hover {
            background: #047857;
        }
        .test-cards {
            margin-top: 24px;
            padding: 16px;
            background: #fef3c7;
            border-radius: 8px;
            font-size: 12px;
        }
        .test-cards h3 {
            margin: 0 0 8px 0;
            font-size: 14px;
        }
        .card-code {
            font-family: monospace;
            background: #fde68a;
            padding: 2px 4px;
            border-radius: 4px;
        }
        .error {
            color: #dc2626;
            font-size: 12px;
            margin-top: 4px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">📱</div>
            <h1>VodaPay Sandbox</h1>
            <p class="amount">R${amount || '100'}.00</p>
        </div>

        <form id="paymentForm">
            <div class="card-input">
                <label>Card Number</label>
                <input type="text" id="cardNumber" placeholder="4444 4444 4444 4400" maxlength="19">
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                <div>
                    <label>Expiry Date</label>
                    <input type="text" placeholder="MM/YY" id="expiry">
                </div>
                <div>
                    <label>CVC</label>
                    <input type="text" placeholder="123" id="cvc" maxlength="3">
                </div>
            </div>
            <button type="submit">Pay Now</button>
        </form>

        <div class="test-cards">
            <h3>🔬 Sandbox Test Cards</h3>
            <p><span class="card-code">4444 4444 4444 4400</span> - ✅ Approved</p>
            <p><span class="card-code">4444 4444 4444 4405</span> - ❌ Do not honour</p>
            <p><span class="card-code">4444 4444 4444 4451</span> - ❌ Insufficient Funds</p>
            <p><span class="card-code">4444 4444 4444 4499</span> - ❌ 3DSecure Fail</p>
            <p style="margin-top: 8px; font-size: 11px;">Use any expiry (e.g., 12/34) and any CVC (e.g., 123)</p>
        </div>
    </div>

    <script>
        const transactionId = '${transactionId}';
        
        document.getElementById('paymentForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const cardNumber = document.getElementById('cardNumber').value.replace(/\\s/g, '');
            const expiry = document.getElementById('expiry').value;
            const cvc = document.getElementById('cvc').value;
            
            // Determine payment status based on card number
            let status = 'FAILED';
            let message = 'Payment failed';
            
            if (cardNumber === '4444444444444400') {
                status = 'SUCCESS';
                message = 'Payment successful';
            } else if (cardNumber === '4444444444444405') {
                status = 'FAILED';
                message = 'Do not honour';
            } else if (cardNumber === '4444444444444451') {
                status = 'FAILED';
                message = 'Insufficient funds';
            } else if (cardNumber === '4444444444444499') {
                status = 'FAILED';
                message = '3DSecure verification failed';
            } else if (cardNumber === '4444444444444441') {
                status = 'FAILED';
                message = 'Payment token blocked';
            } else {
                status = 'FAILED';
                message = 'Invalid test card number';
            }
            
            // Redirect based on payment status
            if (status === 'SUCCESS') {
                window.location.href = '/payment/vodapay/return?status=SUCCESS&transactionId=' + transactionId;
            } else {
                alert('Payment ' + status + ': ' + message);
                window.location.href = '/payment/vodapay/cancel?status=' + status + '&message=' + encodeURIComponent(message);
            }
        });
        
        // Format card number as user types
        document.getElementById('cardNumber').addEventListener('input', function(e) {
            let value = e.target.value.replace(/\\D/g, '');
            if (value.length > 16) value = value.slice(0, 16);
            value = value.replace(/(\\d{4})(?=\\d)/g, '$1 ');
            e.target.value = value;
        });
        
        // Format expiry
        document.getElementById('expiry').addEventListener('input', function(e) {
            let value = e.target.value.replace(/\\D/g, '');
            if (value.length >= 2) {
                value = value.slice(0,2) + '/' + value.slice(2);
            }
            e.target.value = value;
        });
    </script>
</body>
</html>
  `;

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
}
