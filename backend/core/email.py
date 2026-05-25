import aiosmtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
from typing import Optional, Dict, Any, List
from jinja2 import Environment, FileSystemLoader, select_autoescape
import os
from pathlib import Path

from instance.config import config
from core.logger import Logger

logger = Logger.get_logger(__file__, __name__)

# Setup Jinja2 environment for email templates
template_dir = Path(__file__).parent.parent / "templates" / "emails"
if not template_dir.exists():
    template_dir.mkdir(parents=True, exist_ok=True)

jinja_env = Environment(
    loader=FileSystemLoader(str(template_dir)),
    autoescape=select_autoescape(['html', 'xml'])
)


class EmailService:
    """Email service for sending emails asynchronously."""
    
    def __init__(self):
        self._reload_config()

    def _reload_config(self):
        self.smtp_host = config.EMAIL_CONFIG.SMTP_HOST
        self.smtp_port = config.EMAIL_CONFIG.SMTP_PORT
        self.smtp_use_tls = config.EMAIL_CONFIG.SMTP_USE_TLS
        self.smtp_use_starttls = config.EMAIL_CONFIG.SMTP_USE_STARTTLS
        self.smtp_username = config.EMAIL_CONFIG.SMTP_USERNAME
        self.smtp_password = config.EMAIL_CONFIG.SMTP_PASSWORD
        self.from_email = config.EMAIL_CONFIG.SMTP_FROM_EMAIL
        self.frontend_url = config.EMAIL_CONFIG.FRONTEND_URL

    def _get_smtp_attempts(self):
        attempts = [
            {
                "host": self.smtp_host,
                "port": self.smtp_port,
                "use_tls": self.smtp_use_tls,
                "use_starttls": self.smtp_use_starttls,
            }
        ]

        fallback = {
            "host": self.smtp_host,
            "port": 587,
            "use_tls": False,
            "use_starttls": True,
        }

        if (fallback["port"], fallback["use_tls"], fallback["use_starttls"]) != (
            self.smtp_port,
            self.smtp_use_tls,
            self.smtp_use_starttls,
        ):
            attempts.append(fallback)

        return attempts
    
    async def send_email(
        self,
        to_email: str,
        subject: str,
        html_content: str,
        text_content: Optional[str] = None,
        attachments: Optional[List[Dict[str, Any]]] = None
    ) -> bool:
        """
        Send an email asynchronously.
        
        Args:
            to_email: Recipient email address
            subject: Email subject
            html_content: HTML email body
            text_content: Plain text email body (optional)
        
        Returns:
            bool: True if email was sent successfully, False otherwise
        """
        try:
            self._reload_config()
            print(f"[EMAIL_SERVICE] Starting email send to {to_email} with subject: {subject}")  # Immediate output
            logger.info(f"Starting email send to {to_email} with subject: {subject}")
            logger.debug(f"SMTP config: host={self.smtp_host}, port={self.smtp_port}, from={self.from_email}")
            print(f"[EMAIL_SERVICE] SMTP config: host={self.smtp_host}, port={self.smtp_port}, from={self.from_email}")  # Immediate output
            print(f"[EMAIL_SERVICE] SMTP security: use_tls={self.smtp_use_tls}, starttls={self.smtp_use_starttls}")  # Immediate output
            
            # Create message
            message = MIMEMultipart('alternative')
            message['From'] = self.from_email
            message['To'] = to_email
            message['Subject'] = subject
            
            # Add both plain text and HTML versions
            if text_content:
                part1 = MIMEText(text_content, 'plain')
                message.attach(part1)
                logger.debug("Plain text part attached")
            
            part2 = MIMEText(html_content, 'html')
            message.attach(part2)
            logger.debug("HTML part attached")

            if attachments:
                for attachment in attachments:
                    filename = attachment.get("filename", "attachment")
                    content_type = attachment.get("content_type", "application/octet-stream")
                    data = attachment.get("data", b"")
                    if not data:
                        continue
                    maintype, subtype = (content_type.split("/", 1) + ["octet-stream"])[:2]
                    part = MIMEBase(maintype, subtype)
                    part.set_payload(data)
                    encoders.encode_base64(part)
                    part.add_header("Content-Disposition", f"attachment; filename={filename}")
                    message.attach(part)
            
            # Support both implicit TLS and STARTTLS, configurable from env.
            import asyncio
            import aiosmtplib.errors
            last_error = None

            for attempt in self._get_smtp_attempts():
                print(
                    f"[EMAIL_SERVICE] Connecting to SMTP server {attempt['host']}:{attempt['port']} "
                    f"(tls={attempt['use_tls']}, starttls={attempt['use_starttls']})"
                )  # Immediate output
                logger.info(
                    f"Connecting to SMTP server {attempt['host']}:{attempt['port']} "
                    f"(tls={attempt['use_tls']}, starttls={attempt['use_starttls']})"
                )

                smtp = aiosmtplib.SMTP(
                    hostname=attempt["host"],
                    port=attempt["port"],
                    timeout=30,
                    use_tls=attempt["use_tls"],
                    start_tls=False,
                )

                try:
                    print(f"[EMAIL_SERVICE] SMTP object created, calling connect()...")  # Immediate output
                    await asyncio.wait_for(smtp.connect(), timeout=30.0)
                    print(f"[EMAIL_SERVICE] SMTP connection established!")  # Immediate output
                    logger.debug("SMTP connection established")

                    print(f"[EMAIL_SERVICE] Sending EHLO...")  # Immediate output
                    await asyncio.wait_for(smtp.ehlo(), timeout=10.0)
                    print(f"[EMAIL_SERVICE] EHLO sent successfully!")  # Immediate output

                    if attempt["use_starttls"]:
                        try:
                            print(f"[EMAIL_SERVICE] Attempting TLS upgrade (STARTTLS)...")  # Immediate output
                            await asyncio.wait_for(smtp.starttls(), timeout=10.0)
                            print(f"[EMAIL_SERVICE] TLS upgrade completed!")  # Immediate output
                            logger.debug("TLS upgrade completed")

                            print(f"[EMAIL_SERVICE] Sending EHLO after TLS...")  # Immediate output
                            await asyncio.wait_for(smtp.ehlo(), timeout=10.0)
                            print(f"[EMAIL_SERVICE] EHLO after TLS sent successfully!")  # Immediate output
                        except (aiosmtplib.errors.SMTPException, Exception) as tls_err:
                            error_str = str(tls_err)
                            if "already using TLS" in error_str or "Connection already using TLS" in error_str:
                                print(f"[EMAIL_SERVICE] Connection already using TLS, continuing without STARTTLS...")  # Immediate output
                                logger.debug("Connection already using TLS, skipping STARTTLS")
                            else:
                                print(f"[EMAIL_SERVICE] STARTTLS error (not 'already using TLS'), re-raising: {error_str}")  # Immediate output
                                raise

                    print(f"[EMAIL_SERVICE] Logging in as {self.smtp_username}...")  # Immediate output
                    logger.debug(f"Logging in as {self.smtp_username}...")
                    await asyncio.wait_for(smtp.login(self.smtp_username, self.smtp_password), timeout=10.0)
                    print(f"[EMAIL_SERVICE] Login successful!")  # Immediate output
                    logger.debug("Login successful")

                    print(f"[EMAIL_SERVICE] Sending message to {to_email}...")  # Immediate output
                    logger.debug(f"Sending message to {to_email}...")
                    errors = await asyncio.wait_for(smtp.send_message(message), timeout=30.0)
                    if errors:
                        print(f"[EMAIL_SERVICE] WARNING: SMTP returned errors: {errors}")  # Immediate output
                        logger.warning(f"SMTP send_message returned errors: {errors}")
                    else:
                        print(f"[EMAIL_SERVICE] Message sent successfully (no errors)!")  # Immediate output
                        logger.debug("Message sent successfully (no errors returned)")

                    print(f"[EMAIL_SERVICE] Closing SMTP connection...")  # Immediate output
                    await smtp.quit()
                    print(f"[EMAIL_SERVICE] SMTP connection closed!")  # Immediate output
                    last_error = None
                    break

                except Exception as e:
                    last_error = e
                    print(f"[EMAIL_SERVICE ERROR] SMTP attempt failed: {str(e)}")  # Immediate output
                    logger.error(f"SMTP attempt failed: host={attempt['host']} port={attempt['port']} error={str(e)}")
                    try:
                        await smtp.quit()
                    except:
                        pass

            if last_error is not None:
                raise last_error
            
            print(f"[EMAIL_SERVICE] Email sent successfully to {to_email}!")  # Immediate output
            logger.info(f"Email sent successfully to {to_email}")
            return True
            
        except Exception as e:
            import traceback
            print(f"[EMAIL_SERVICE ERROR] Failed to send email: {str(e)}")  # Immediate output
            print(f"[EMAIL_SERVICE ERROR] Type: {type(e).__name__}")  # Immediate output
            logger.error(f"Failed to send email to {to_email}: {str(e)}")
            logger.error(f"Error type: {type(e).__name__}")
            logger.error(f"Full traceback:\n{''.join(traceback.format_exc())}")
            print(f"[EMAIL_SERVICE ERROR] Traceback:\n{''.join(traceback.format_exc())}")  # Immediate output
            return False
    
    def render_template(self, template_name: str, context: Dict[str, Any]) -> str:
        """
        Render an email template with the given context.
        
        Args:
            template_name: Name of the template file
            context: Dictionary of variables to pass to the template
        
        Returns:
            str: Rendered HTML content
        """
        try:
            template = jinja_env.get_template(template_name)
            return template.render(**context)
        except Exception as e:
            logger.error(f"Failed to render template {template_name}: {str(e)}")
            raise
    
    async def send_confirmation_email(self, to_email: str, first_name: str, confirmation_token: str) -> bool:
        """Send email confirmation email."""
        confirmation_url = f"{self.frontend_url}/verify-email?token={confirmation_token}"
        
        html_content = self.render_template("email_confirmation.html", {
            "first_name": first_name,
            "confirmation_url": confirmation_url,
            "frontend_url": self.frontend_url
        })
        
        text_content = f"""
Hello {first_name},

Thank you for signing up! Please confirm your email address by clicking the link below:

{confirmation_url}

If you didn't create an account, please ignore this email.

Best regards,
MS Performance Team
"""
        
        return await self.send_email(
            to_email=to_email,
            subject="Confirm Your Email Address - MS Performance",
            html_content=html_content,
            text_content=text_content
        )
    
    async def send_password_reset_email(self, to_email: str, first_name: str, reset_token: str) -> bool:
        """Send password reset email."""
        reset_url = f"{self.frontend_url}/reset-password?token={reset_token}"
        
        html_content = self.render_template("password_reset.html", {
            "first_name": first_name,
            "reset_url": reset_url,
            "frontend_url": self.frontend_url
        })
        
        text_content = f"""
Hello {first_name},

We received a request to reset your password. Click the link below to set a new password:

{reset_url}

This link will expire in 1 hour. If you didn't request a password reset, please ignore this email.

Best regards,
MS Performance Team
"""
        
        return await self.send_email(
            to_email=to_email,
            subject="Reset Your Password - MS Performance",
            html_content=html_content,
            text_content=text_content
        )
    
    async def send_order_confirmation_email(
        self,
        to_email: str,
        first_name: str,
        order_number: str,
        order_items: list,
        subtotal: float,
        tax: float,
        shipping_cost: float,
        total: float
    ) -> bool:
        """Send order confirmation email."""
        html_content = self.render_template("order_confirmation.html", {
            "first_name": first_name,
            "order_number": order_number,
            "order_items": order_items,
            "subtotal": subtotal,
            "tax": tax,
            "shipping_cost": shipping_cost,
            "total": total,
            "frontend_url": self.frontend_url
        })
        
        text_content = f"""
Hello {first_name},

Thank you for your order! Your order #{order_number} has been received.

Order Details:
Total: £{total:.2f}

We'll send you another email when your order ships.

Best regards,
MS Performance Team
"""
        
        return await self.send_email(
            to_email=to_email,
            subject=f"Order Confirmation #{order_number} - MS Performance",
            html_content=html_content,
            text_content=text_content
        )
    
    async def send_appointment_confirmation_email(
        self,
        to_email: str,
        customer_name: str,
        appointment_date: str,
        appointment_time: str,
        service_type: str,
        vehicle_info: Optional[str] = None,
        customer_phone: Optional[str] = None,
        notes: Optional[str] = None
    ) -> bool:
        """Send appointment confirmation email."""
        html_content = self.render_template("appointment_confirmation.html", {
            "customer_name": customer_name,
            "appointment_date": appointment_date,
            "appointment_time": appointment_time,
            "service_type": service_type,
            "vehicle_info": vehicle_info,
            "frontend_url": self.frontend_url
        })
        
        text_content = f"""
Hello {customer_name},

Your appointment has been confirmed!

Appointment Details:
- Date: {appointment_date}
- Time: {appointment_time}
- Service: {service_type}
{f'- Vehicle: {vehicle_info}' if vehicle_info else ''}

Please arrive 5-10 minutes before your appointment.

If you need to cancel or reschedule, please contact us.

Best regards,
MS Performance Team
"""
        
        # Send confirmation to the customer
        success = await self.send_email(
            to_email=to_email,
            subject="Appointment Confirmed - MS Performance",
            html_content=html_content,
            text_content=text_content
        )
        
        # Send notification to the admin/sender email
        admin_text_content = f"""
New Appointment Booked!

Customer details:
- Name: {customer_name}
- Email: {to_email}
{f'- Phone: {customer_phone}' if customer_phone else ''}

Appointment Details:
- Date: {appointment_date}
- Time: {appointment_time}
- Service: {service_type}
{f'- Vehicle: {vehicle_info}' if vehicle_info else ''}
{f'- Notes: {notes}' if notes else ''}
"""
        
        # Render the styled HTML wrapper for the admin
        admin_html_content = self.render_template("admin_appointment_notification.html", {
            "customer_name": customer_name,
            "customer_email": to_email,
            "customer_phone": customer_phone,
            "appointment_date": appointment_date,
            "appointment_time": appointment_time,
            "service_type": service_type,
            "vehicle_info": vehicle_info,
            "notes": notes,
            "frontend_url": self.frontend_url
        })
        
        await self.send_email(
            to_email=self.from_email,
            subject=f"New Appointment: {customer_name} - {service_type}",
            html_content=admin_html_content,
            text_content=admin_text_content
        )
        
        return success

    async def send_newsletter_email(
        self,
        to_email: str,
        customer_name: str,
        subject: str,
        content: str,
        attachments: Optional[List[Dict[str, Any]]] = None
    ) -> bool:
        """Send newsletter email."""
        html_content = self.render_template("newsletter.html", {
            "customer_name": customer_name,
            "subject": subject,
            "content": content,
            "frontend_url": self.frontend_url
        })

        text_content = f"""
Hello {customer_name},

{content}

Best regards,
MS Performance Team
"""

        return await self.send_email(
            to_email=to_email,
            subject=subject,
            html_content=html_content,
            text_content=text_content,
            attachments=attachments
        )

    async def send_contact_notification_email(
        self,
        name: str,
        email: str,
        message: str,
        phone: Optional[str] = None,
        address: Optional[str] = None,
        subject: Optional[str] = None,
    ) -> bool:
        """Send contact form notification email to the admin/SMTP sender."""
        html_content = self.render_template("contact_notification.html", {
            "name": name,
            "email": email,
            "phone": phone,
            "address": address,
            "subject": subject,
            "message": message,
            "frontend_url": self.frontend_url,
        })

        text_content = f"""
New Contact Form Submission

From: {name} ({email})
{f'Phone: {phone}' if phone else ''}
{f'Address: {address}' if address else ''}
{f'Subject: {subject}' if subject else ''}

Message:
{message}

---
This is an automated notification from your website contact form.
"""

        email_subject = f"New Contact Message from {name}"
        if subject:
            email_subject = f"Contact: {subject} - from {name}"

        return await self.send_email(
            to_email=self.from_email,
            subject=email_subject,
            html_content=html_content,
            text_content=text_content,
        )


email_service = EmailService()
