@startuml
skinparam linetype ortho

package "Identity & Access" {
  entity "User" as user {
    *id : UUID
    --
    username : VARCHAR
    email : VARCHAR
    role : ENUM(Traveler, Host, Admin, Mod, Kiosk)
    kyc_status : ENUM(Unverified, Verified)
    phone_number : VARCHAR
    kiosk_id : VARCHAR
  }

  entity "InviteCode" as invite {
    *id : INT
    --
    code : VARCHAR
    assigned_role : VARCHAR
    max_usage : INT
    current_usage : INT
    expiry_date : DATETIME
    is_active : BOOLEAN
    created_by_id : UUID <<FK>>
  }
}

package "Listings (Hotspots)" {
  entity "Hotspot" as hotspot {
    *id : INT
    --
    *host_id : UUID <<FK>>
    name : VARCHAR
    description : TEXT
    district : VARCHAR
    status : ENUM(Draft, Pending, Approved, Rejected)
    moderation_notes : TEXT
  }

  entity "Media" as media {
    *id : INT
    --
    *hotspot_id : INT <<FK>>
    file : VARCHAR
    type : VARCHAR
    is_cover : BOOLEAN
  }

  entity "Review" as review {
    *id : INT
    --
    *hotspot_id : INT <<FK>>
    *author_id : UUID <<FK>>
    rating : INT
    comment : TEXT
  }
}

package "Safety & Governance" {
  entity "ModerationTicket" as ticket {
    *id : INT
    --
    content_type : VARCHAR
    object_id : VARCHAR
    *reported_by_id : UUID <<FK>>
    *assigned_to_id : UUID <<FK>>
    reason : VARCHAR
    status : ENUM(Open, Resolved, Dismissed)
  }

  entity "AuditLog" as audit {
    *id : INT
    --
    *actor_id : UUID <<FK>>
    action : VARCHAR
    target_model : VARCHAR
    object_id : VARCHAR
    changes : JSON
    timestamp : DATETIME
  }

  entity "FeatureFlag" as feature {
    *id : INT
    --
    name : VARCHAR
    is_global_enabled : BOOLEAN
    rollout_percentage : INT
  }
}

package "Commerce" {
  entity "QRCode" as qr {
    *id : UUID
    --
    *host_id : UUID <<FK>>
    amount : DECIMAL
    is_active : BOOLEAN
  }

  entity "Transaction" as txn {
    *id : UUID
    --
    *buyer_id : UUID <<FK>>
    *seller_id : UUID <<FK>>
    amount : DECIMAL
    status : VARCHAR
  }
}

' Relationships
user ||..o{ invite : "created_invites"
user ||..o{ hotspot : "owns"
user ||..o{ review : "writes"
user ||..o{ ticket : "reports"
user ||..o{ ticket : "moderates"
user ||..o{ audit : "actor"
user ||..o{ qr : "generates"
user ||..o{ txn : "buys/sells"

hotspot ||..o{ media : "has"
hotspot ||..o{ review : "has"

@enduml
