from django.utils import timezone
from django.core.exceptions import ValidationError
from .models import Hotspot, ModerationTicket

class HotspotService:
    @staticmethod
    def create_draft(host, data):
        """Create a new hotspot in DRAFT status"""
        hotspot = Hotspot.objects.create(
            host=host,
            status=Hotspot.Status.Draft,
            **data
        )
        return hotspot

    @staticmethod
    def update_draft(hotspot, data, user):
        """Update a draft. Only host can update."""
        if hotspot.host != user:
            raise ValidationError("Not authorized to edit this hotspot")
        
        if hotspot.status not in [Hotspot.Status.Draft, Hotspot.Status.ChangesRequested]:
            raise ValidationError("Cannot edit hotspot in current status")

        for key, value in data.items():
            setattr(hotspot, key, value)
        
        # If it was ChangesRequested, move back to Draft on edit? 
        # Or keep as ChangesRequested until they submit?
        # Usually edit -> Draft or just stay. Let's keep status unless explicitly moved.
        hotspot.save()
        return hotspot

    @staticmethod
    def submit_for_review(hotspot, user):
        """Draft -> Under Review"""
        if hotspot.host != user:
            raise ValidationError("Not authorized")
        
        if hotspot.status not in [Hotspot.Status.Draft, Hotspot.Status.ChangesRequested]:
            raise ValidationError("Hotspot is not in a state to be submitted")

        # Perform Auto-Scan for disallowed content (Placement for future)
        # if ScanService.detect_bad_content(hotspot): ...
        
        hotspot.status = Hotspot.Status.Pending
        hotspot.save()
        return hotspot

    @staticmethod
    def approve(hotspot, moderator):
        """Under Review -> Approved"""
        if hotspot.status != Hotspot.Status.Pending:
            raise ValidationError("Hotspot is not under review")
        
        hotspot.status = Hotspot.Status.Approved
        hotspot.approved_by = moderator
        hotspot.moderation_notes += f"\n[Approved by {moderator} on {timezone.now()}]"
        hotspot.save()
        return hotspot

    @staticmethod
    def request_changes(hotspot, moderator, notes):
        """Under Review -> Changes Requested. Creates ticket."""
        if hotspot.status != Hotspot.Status.Pending:
            raise ValidationError("Hotspot is not under review")
        
        hotspot.status = Hotspot.Status.ChangesRequested
        hotspot.moderation_notes += f"\n[Changes Requested by {moderator}: {notes}]"
        hotspot.save()

        # Create Ticket
        ModerationTicket.objects.create(
            hotspot=hotspot,
            reason_code=ModerationTicket.Reason.Quality, # Generic or pass in
            notes=notes,
            status=ModerationTicket.Status.Open,
            assigned_to=moderator
        )
        return hotspot

    @staticmethod
    def publish(hotspot, moderator):
        """Approved -> Live"""
        if hotspot.status != Hotspot.Status.Approved:
            raise ValidationError("Hotspot must be Approved first")
        
        hotspot.status = Hotspot.Status.Live
        hotspot.save()
        return hotspot

    @staticmethod
    def suspend(hotspot, moderator, reason):
        """Live -> Suspended"""
        hotspot.status = Hotspot.Status.Suspended
        
        ModerationTicket.objects.create(
            hotspot=hotspot,
            reason_code=ModerationTicket.Reason.Policy,
            notes=f"Suspended: {reason}",
            status=ModerationTicket.Status.Open,
            assigned_to=moderator
        )
        
        hotspot.save()
        return hotspot
