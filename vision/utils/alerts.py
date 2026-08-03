import time

class AlertSystem:
    def __init__(self):
        self.alerts = []

    def trigger_alert(self, camera_id, alert_type, message, severity="warning"):
        """
        Creates an alert and stores it. In a real system, this would send an email, SMS, or trigger a webhook.
        """
        alert = {
            "id": len(self.alerts) + 1,
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
            "camera_id": camera_id,
            "type": alert_type,
            "message": message,
            "severity": severity # info, warning, critical
        }
        self.alerts.append(alert)
        print(f"[{severity.upper()}] Cam {camera_id}: {message} at {alert['timestamp']}")
        return alert

    def get_latest_alerts(self, limit=10):
        return sorted(self.alerts, key=lambda x: x['timestamp'], reverse=True)[:limit]

alert_system = AlertSystem()
