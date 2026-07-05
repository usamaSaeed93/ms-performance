"""
GET endpoint that handles Approve / Deny clicks from the admin email.

URL pattern:
    GET /ecommerce/v1/appointments/{appointment_id}/email-action?action=approve&token=xxx

Returns an HTML page (not JSON) so the admin sees a nice result in their
browser after clicking the link.
"""

import asyncio
from fastapi import status
from fastapi.responses import HTMLResponse

from api.base_resource import GetResource
from crud.appointment import get_appointment_by_id, update_appointment_status
from core.appointment_token import verify_email_action_token
from core.email import email_service
from core.google_calendar import google_calendar


def _html_page(title: str, heading: str, message: str, success: bool = True) -> str:
    """Build a simple branded HTML response page."""
    icon = "✅" if success else "❌"
    accent = "#22c55e" if success else "#ef4444"
    return f"""<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title} — MS Performance</title>
    <style>
        * {{ margin: 0; padding: 0; box-sizing: border-box; }}
        body {{
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #030814 0%, #0f172a 100%);
            color: #e2e8f0;
            padding: 24px;
        }}
        .card {{
            max-width: 480px;
            width: 100%;
            background: #1e293b;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 25px 50px rgba(0,0,0,.4);
        }}
        .card-header {{
            background: {accent};
            padding: 32px 24px;
            text-align: center;
        }}
        .card-header .icon {{ font-size: 48px; }}
        .card-header h1 {{
            font-size: 22px;
            font-weight: 700;
            color: #fff;
            margin-top: 12px;
        }}
        .card-body {{
            padding: 32px 24px;
            text-align: center;
            line-height: 1.7;
            color: #94a3b8;
            font-size: 15px;
        }}
        .card-footer {{
            padding: 16px 24px 24px;
            text-align: center;
        }}
        .card-footer a {{
            color: {accent};
            text-decoration: none;
            font-weight: 600;
        }}
        .card-footer a:hover {{ text-decoration: underline; }}
    </style>
</head>
<body>
    <div class="card">
        <div class="card-header">
            <div class="icon">{icon}</div>
            <h1>{heading}</h1>
        </div>
        <div class="card-body">
            {message}
        </div>
        <div class="card-footer">
            <p style="color:#64748b;font-size:12px;margin-top:8px;">© 2026 MS Performance</p>
        </div>
    </div>
</body>
</html>"""


class AppointmentEmailAction(GetResource):
    """Handle approve / deny actions triggered from the admin email."""

    api_name = "appointment_email_action"
    api_url = "appointments/{appointment_id}/email-action"
    authentication_required = False  # Token-based auth via HMAC

    async def process_flow(self):
        appointment_id_raw = self.request.path_params.get("appointment_id")
        action = self.request.query_params.get("action")
        token = self.request.query_params.get("token")

        # --- Validate inputs ---
        try:
            appointment_id = int(appointment_id_raw)
        except (TypeError, ValueError):
            self._set_html_error("Invalid appointment ID.")
            return

        if action not in ("approve", "deny"):
            self._set_html_error("Invalid action. Expected 'approve' or 'deny'.")
            return

        if not token or not verify_email_action_token(appointment_id, action, token):
            self._set_html_error(
                "Invalid or expired token. Please use the link from the original email."
            )
            return

        # --- Fetch appointment ---
        appointment = await get_appointment_by_id(self.db, appointment_id)
        if not appointment:
            self._set_html_error("Appointment not found.")
            return

        if appointment.status != "pending":
            self._set_html_info(
                f"This appointment has already been <strong>{appointment.status}</strong>. "
                "No further action is needed."
            )
            return

        # --- Update status ---
        new_status = "confirmed" if action == "approve" else "denied"
        updated = await update_appointment_status(self.db, appointment_id, new_status)
        if not updated:
            self._set_html_error("Failed to update appointment. Please try again via the dashboard.")
            return

        # --- Fire side-effects (email + Google Calendar) ---
        try:
            asyncio.create_task(
                self._handle_side_effects(appointment, new_status)
            )
        except Exception as exc:
            print(f"Failed to queue email-action side-effects: {exc}")

        # --- Success page ---
        if action == "approve":
            html = _html_page(
                title="Appointment Approved",
                heading="Appointment Approved",
                message=(
                    f"The appointment for <strong>{appointment.customer_name}</strong> "
                    f"on <strong>{appointment.appointment_date.strftime('%A, %B %d, %Y')}</strong> "
                    f"at <strong>{appointment.appointment_time.strftime('%I:%M %p')}</strong> "
                    f"has been confirmed.<br><br>"
                    f"A confirmation email has been sent to <strong>{appointment.customer_email}</strong>."
                ),
                success=True,
            )
        else:
            html = _html_page(
                title="Appointment Denied",
                heading="Appointment Denied",
                message=(
                    f"The appointment for <strong>{appointment.customer_name}</strong> "
                    f"on <strong>{appointment.appointment_date.strftime('%A, %B %d, %Y')}</strong> "
                    f"at <strong>{appointment.appointment_time.strftime('%I:%M %p')}</strong> "
                    f"has been denied.<br><br>"
                    f"A notification has been sent to <strong>{appointment.customer_email}</strong>."
                ),
                success=False,
            )

        self.dont_postprocess = True
        self._html_response = HTMLResponse(content=html, status_code=200)

    async def _handle_side_effects(self, appt, new_status: str):
        """Send customer notification email and optionally sync to Google Calendar."""
        fmt_date = appt.appointment_date.strftime("%A, %B %d, %Y")
        fmt_time = appt.appointment_time.strftime("%I:%M %p")
        vehicle_info = None
        if appt.vehicle_make:
            vehicle_info = f"{appt.vehicle_make} {appt.vehicle_model or ''}".strip()

        if new_status == "confirmed":
            try:
                await email_service.send_appointment_confirmation_email(
                    to_email=appt.customer_email,
                    customer_name=appt.customer_name,
                    appointment_date=fmt_date,
                    appointment_time=fmt_time,
                    service_type=appt.service_type,
                    vehicle_info=vehicle_info,
                    customer_phone=appt.customer_phone,
                    notes=appt.notes,
                )
            except Exception as exc:
                print(f"Failed to send confirmation email: {exc}")

            # Google Calendar sync
            try:
                from datetime import datetime, timezone, timedelta
                appt_date = appt.appointment_date
                appt_time = appt.appointment_time
                start_dt = datetime(
                    appt_date.year, appt_date.month, appt_date.day,
                    appt_time.hour, appt_time.minute, appt_time.second,
                    tzinfo=timezone.utc,
                )
                end_dt = start_dt + timedelta(minutes=60)
                vehicle_str = ""
                if appt.vehicle_make:
                    vehicle_str = f"\nVehicle: {appt.vehicle_make} {appt.vehicle_model or ''}"
                    if appt.vehicle_registration:
                        vehicle_str += f" ({appt.vehicle_registration})"
                description = (
                    f"Customer: {appt.customer_name}\n"
                    f"Phone: {appt.customer_phone or 'N/A'}\n"
                    f"Email: {appt.customer_email}\n"
                    f"Service: {appt.service_type}"
                    f"{vehicle_str}"
                    f"{chr(10) + 'Notes: ' + appt.notes if appt.notes else ''}"
                )
                await google_calendar.create_event(
                    summary=f"{appt.service_type} — {appt.customer_name}",
                    description=description,
                    start_datetime=start_dt,
                    end_datetime=end_dt,
                    attendee_email=appt.customer_email,
                )
            except Exception as exc:
                print(f"Failed to sync to Google Calendar: {exc}")

        elif new_status == "denied":
            try:
                await email_service.send_appointment_denied_email(
                    to_email=appt.customer_email,
                    customer_name=appt.customer_name,
                    appointment_date=fmt_date,
                    appointment_time=fmt_time,
                    service_type=appt.service_type,
                )
            except Exception as exc:
                print(f"Failed to send denial email: {exc}")

    # --- Helpers to short-circuit with HTML responses ---

    def _set_html_error(self, msg: str):
        html = _html_page(
            title="Action Failed",
            heading="Action Failed",
            message=msg,
            success=False,
        )
        self.dont_postprocess = True
        self._html_response = HTMLResponse(content=html, status_code=400)

    def _set_html_info(self, msg: str):
        html = _html_page(
            title="Already Processed",
            heading="Already Processed",
            message=msg,
            success=True,
        )
        self.dont_postprocess = True
        self._html_response = HTMLResponse(content=html, status_code=200)

    async def run_postprocess(self):
        """Override to return HTMLResponse instead of JSON when needed."""
        if self.dont_postprocess and hasattr(self, "_html_response"):
            await self.db.close()
            return self._html_response
        return await super().run_postprocess()
