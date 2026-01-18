from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.core import security
from app.models.models import User, UserRole, HostProfile, Hotspot, HotspotStatus

async def init_db(db: AsyncSession) -> None:
    # 1. Create Superuser
    stmt = select(User).where(User.email == "admin@projectx.com")
    result = await db.execute(stmt)
    user = result.scalars().first()
    if not user:
        user = User(
            email="admin@projectx.com",
            hashed_password=security.get_password_hash("admin123"),
            role=UserRole.ADMIN,
            is_active=True,
        )
        db.add(user)
        print("Superuser created")

    # 2. Create Moderator
    stmt = select(User).where(User.email == "mod@projectx.com")
    result = await db.execute(stmt)
    user = result.scalars().first()
    if not user:
        user = User(
            email="mod@projectx.com",
            hashed_password=security.get_password_hash("mod123"),
            role=UserRole.MODERATOR,
            is_active=True,
        )
        db.add(user)
        print("Moderator created")

    # 3. Create Host
    stmt = select(User).where(User.email == "host@projectx.com")
    result = await db.execute(stmt)
    host_user = result.scalars().first()
    if not host_user:
        host_user = User(
            email="host@projectx.com",
            hashed_password=security.get_password_hash("host123"),
            role=UserRole.HOST,
            is_active=True,
        )
        db.add(host_user)
        await db.commit() # Commit to get ID
        await db.refresh(host_user)
        
        # Profile
        hp = HostProfile(user_id=host_user.id, business_name="Best Cafe")
        db.add(hp)
        await db.commit()
        await db.refresh(hp)
        
        # Hotspot
        h1 = Hotspot(
            host_id=hp.id,
            name="Hidden Gem Cafe",
            description="A quiet place on the corner of 5th D-Street. No crowds.",
            district="District 9",
            status=HotspotStatus.APPROVED
        )
        db.add(h1)
        print("Host and Hotspot created")
        
    await db.commit()
