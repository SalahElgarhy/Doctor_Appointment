// دالة لإنشاء HTML بسيط لتفعيل الإيميل
export const signup = (link, userName = "user dear") => {
    return `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>تفعيل حسابك - Sarah App</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 20px;
                direction: rtl;
            }
            .container {
                max-width: 500px;
                margin: 0 auto;
                background: white;
                border-radius: 10px;
                box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                overflow: hidden;
            }
            .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 30px;
                text-align: center;
            }
            .header h1 {
                font-size: 2em;
                margin: 0;
            }
            .content {
                padding: 30px;
                text-align: center;
            }
            .welcome-message {
                font-size: 1.2em;
                color: #333;
                margin-bottom: 25px;
            }
            .activation-button {
                display: inline-block;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 15px 30px;
                text-decoration: none;
                border-radius: 25px;
                font-size: 1.1em;
                font-weight: bold;
                margin: 20px 0;
            }
            .footer {
                background: #f8f9fa;
                padding: 20px;
                text-align: center;
                color: #666;
                font-size: 0.9em;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🌟 مرحباً بك في Sarah App</h1>
            </div>
            
            <div class="content">
                <div class="welcome-message">
                    مرحباً <strong>${userName}</strong>! 🎉
                    <br><br>
                    شكراً لك على التسجيل في تطبيق Sarah App
                </div>
                
                <a href="${link}" class="activation-button">
                    🚀 Active Account
                </a>
                
                <p style="color: #666; margin-top: 20px;">
                    اضغط على الزر أعلاه لتفعيل حسابك
                </p>
            </div>
            
            <div class="footer">
                <p>💌 تم إرسال هذا الإيميل من فريق Sarah App</p>
                <p>© 2025 Sarah App. جميع الحقوق محفوظة.</p>
            </div>
        </div>
    </body>
    </html>
    `;
};