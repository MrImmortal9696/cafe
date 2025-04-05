import emailjs from "emailjs-com";
import { convertTo12HourFormat } from "../hourFormat";

const templates = (data) => {
    // Ensure cart and TaxBreakdown are always arrays to prevent .map() errors
    const cart = data?.cart || [];
    const taxBreakdown = data?.taxBreakdown || [];

    return {
        Login_automated: `
            <html>
            <head><title>Password Reset Confirmation</title></head>
            <body>
                <h2>Hello ${data?.Name || "User"},</h2>
                <p>Below is your generated email & password:</p>
                <p><strong>Email:</strong> ${data?.Email || "Not Provided"}</p>
                <p><strong>Password:</strong> ${data?.Password || "Not Provided"}</p>
                <p>If you didn’t request this, please ignore this email.</p>
                <p>Thanks, <br> Tropical Cafe Team</p>
            </body>
            </html>
        `,
        Registration: `
            <html>
            <head><title>Registration Confirmation</title></head>
            <body>
                <h2>Hello ${data?.Name || "User"},</h2>
                <p>Below is your registration email & password:</p>
                <p><strong>Email:</strong> ${data?.Email || "Not Provided"}</p>
                <p><strong>Password:</strong> ${data?.Password || "Not Provided"}</p>
                <p>If you didn’t request this, please ignore this email.</p>
                <p>Thanks, <br> Tropical Cafe Team</p>
            </body>
            </html>
        `,
        Reservation: `
            <html>
            <head><title>Reservation Confirmation</title></head>
            <body>
                <h2>Hello ${data?.Name || "Guest"},</h2>
                <p>Thank you for booking a reservation with us.</p>
                <p><strong>Reservation Details:</strong></p>
                <ul>
                    <li><strong>Date:</strong> ${data?.ReservationDate || "N/A"}</li>
                    <li><strong>Time:</strong> ${data?.ReservationTime || "N/A"}</li>
                    <li><strong>Guests:</strong> ${data?.NumberOfGuests || "N/A"}</li>
                </ul>
                <p>We look forward to serving you!</p>
                <p>Best regards, <br> Tropical Cafe Team</p>
            </body>
            </html>
        `,
        Order: `
            <html>
            <head>
                <title>Order Confirmation</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f8f9fa;
                        color: #333;
                        padding: 20px;
                    }
                    .container {
                        max-width: 600px;
                        background: #ffffff;
                        padding: 20px;
                        margin: auto;
                        border-radius: 8px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    }
                    h2 {
                        color: #27ae60;
                    }
                    p {
                        font-size: 16px;
                        line-height: 1.5;
                    }
                    .order-details {
                        border-top: 1px solid #ddd;
                        padding-top: 10px;
                    }
                    .cart-item {
                        border-bottom: 1px solid #eee;
                        padding: 10px 0;
                    }
                    .cart-item span {
                        display: inline-block;
                        min-width: 100px;
                    }
                    .total-section {
                        margin-top: 10px;
                        padding-top: 10px;
                        border-top: 2px solid #27ae60;
                        font-weight: bold;
                    }
                    a {
                        color: #007bff;
                        text-decoration: none;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h2>Hello ${data?.Name || "Customer"},</h2>
                    <p>Thank you for your order at Tropical Cafe!</p>
                    <p>Your Order Bill is:</p>
                    <p><strong>£${data?.bill_data?.finalBill || "0.00"}</strong></p>
                    
                    <div class="order-details">
                        ${cart.map(item => `
                            <div class="cart-item">
                                <div>
                                    <span><strong>${item?.name || "Unknown Item"}</strong></span>
                                    <span>Qty: ${item?.quantity || 0}</span>
                                    <span>£${item?.totalPrice || "0.00"}</span>
                                </div>
                                <div>
                                    ${(item?.selections || []).map(option => `
                                        <div>
                                            <span>${option?.name || "N/A"}</span> - <span>£${option?.price || "0.00"}</span>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    
                    <div class="order-details">
                        ${taxBreakdown.map(tax => `
                            <p><span>${tax?.TaxName || "Unknown Tax"} ${tax?.TaxPercentage || 0}% -: </span><span>£${tax?.Amount || "0.00"}</span></p>
                        `).join('')}
                    </div>
                    
                    <div class="total-section">
                        <p><span>SubTotal -: </span><span>£${data?.bill_data?.BasePriceBill || "0.00"}</span></p>
                        <p><span>Taxes -: </span><span>£${data?.bill_data?.TaxBill || "0.00"}</span></p>
                        <p><span>Total -: </span><span>£${data?.bill_data?.TotalBill || "0.00"}</span></p>
                        <p><span>Wallet -: </span><span>£${data?.bill_data?.walletBill || "0.00"}</span></p>
                        <p><span>To Pay -: </span><span>£${data?.bill_data?.finalBill || "0.00"}</span></p>

                    </div>
                    
                    <p>Please check your account for more details at <a href="https://tropicalcafe.co.uk">tropicalcafe.co.uk</a></p>
                    <p>Your order is being prepared and will be ready soon.</p>
                    <p>Thank you for choosing us!</p>
                    <p>Best, <br> Tropical Cafe Team</p>
                </div>
            </body>
            </html>`
    };
};


export const EmailSender = ({
    formData,
    adminEmail,
    adminSubject,
    userSubject,
    adminTemplateId,
    userTemplateId,
    userHtmlContent,
    adminHtmlContent,
    subject_purpose // <-- The new variable for template selection
}) => {
    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const userId = process.env.NEXT_PUBLIC_EMAILJS_USER_ID;
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    // Get the template if `subject_purpose` matches
    const emailTemplates = templates(formData);
    const selectedTemplate = emailTemplates[subject_purpose] || null;

    const userParams = {
        to_email: formData.Email,
        subject: userSubject || "Welcome to Tropical Cafe!",
        html: selectedTemplate ? selectedTemplate : userHtmlContent, // Use template if matched, else default
        from_name: subject_purpose,
        subject_purpose,
        reply_to:process.env.NEXT_PUBLIC_EMAILJS_ADMIN_EMAIL
    };

    // console.log(selectedTemplate)

    if (selectedTemplate) {
        // If a matching template is found, only send to the user
        // console.log(userParams)
        emailjs.send(serviceId, templateId, userParams, userId)
            .then(userResponse => {
                // console.log("User email sent:", userResponse);
                alert("Please check your email inbox for confirmation!");
            })
            .catch(error => {
                // console.error("Email sending error:", error);
                alert("Failed to send email.");
            });
    } else {
        // If no matching template, send both user and admin emails
        const adminParams = {
            to_email: process.env.NEXT_PUBLIC_EMAILJS_ADMIN_EMAIL,
            subject: adminSubject || "New Contact Form Submission",
            html: adminHtmlContent,
            from_name: `${formData.firstName} ${formData.lastName}`,
            subject_purpose
        };

        Promise.all([
            emailjs.send(serviceId, templateId, adminParams, userId),
            emailjs.send(serviceId, templateId, userParams, userId)
        ])
            .then(([adminResponse, userResponse]) => {
                // console.log("Admin email sent:", adminResponse);
                // console.log("User email sent:", userResponse);
                alert("Emails sent successfully!");
            })
            .catch(error => {
                // console.error("Email sending error:", error);
                alert("Failed to send emails.");
            });
    }
};
