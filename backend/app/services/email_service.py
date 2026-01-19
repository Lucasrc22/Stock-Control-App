import smtplib
from email.message import EmailMessage
from datetime import datetime
from app.core.config import settings


def enviar_email_alerta(destinatarios: list[str], produto: str, local: str):
    msg = EmailMessage()
    msg["Subject"] = f"⚠️ Alerta de Estoque Zerado - {produto}"
    msg["From"] = settings.EMAIL_FROM
    msg["To"] = ", ".join(destinatarios)

    msg.set_content(f"""
Olá,

O estoque do produto abaixo foi zerado.

Produto: {produto}
Local: {local}
Data/Hora: {datetime.now().strftime('%d/%m/%Y %H:%M')}

Por favor, providencie a reposição.

— Sistema de Controle de Estoque
""")

    try:
        with smtplib.SMTP(settings.EMAIL_HOST, settings.EMAIL_PORT) as server:
            server.starttls()
            server.login(settings.EMAIL_USER, settings.EMAIL_PASSWORD)
            server.send_message(msg)

    except Exception as e:
        print(f"[ERRO EMAIL] {e}")
