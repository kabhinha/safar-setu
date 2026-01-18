import { type Hotspot, type Booking } from '../types';

export const MOCK_HOTSPOTS: Hotspot[] = [
    {
        id: '1',
        title: 'Mawlynnong Village',
        description: 'Known as the cleanest village in Asia, offering a serene community-led experience.',
        district: 'East Khasi Hills',
        host_id: 'host1',
        // Reliable Jungle/Village Activity
        images: ['https://images.unsplash.com/photo-1533038590840-1cde6e668a91?q=80&w=800&auto=format&fit=crop'],
        story: 'Our village community has maintained a tradition of cleanliness for generations...',
        activities: ['Root Bridge Trek', 'Village Walk', 'Local Cuisine'],
        seasonality: 'Best: Oct-Apr',
        sensitivity: 'PUBLIC',
        location_fuzzy: { lat: 25.2, lng: 91.9 },
        status: 'APPROVED'
    },
    {
        id: '2',
        title: 'Ziro Valley Sanctuary',
        description: 'A protected heritage zone famous for its rice fields and pine forests.',
        district: 'Lower Subansiri',
        host_id: 'host2',
        // Reliable Rice Fields/Greenery
        images: ['https://images.unsplash.com/photo-1476820865390-c52aeebb9891?q=80&w=800&auto=format&fit=crop'],
        story: 'Home to the Apatani tribe, we invite you to learn about our sustainable farming...',
        activities: ['Farm Visit', 'Music Festival History', 'Nature Trail'],
        seasonality: 'Best: Sep-Nov',
        sensitivity: 'PROTECTED',
        location_fuzzy: { lat: 27.6, lng: 93.8 },
        status: 'APPROVED'
    },
    {
        id: '3',
        title: 'Dzukou Valley Retreat',
        description: 'Breathtaking valley views at the border of Nagaland and Manipur.',
        district: 'Kohima',
        host_id: 'host3',
        // Reliable Valley/Hills
        images: ['https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?q=80&w=800&auto=format&fit=crop'],
        story: 'A place of flowers and emerald hills.',
        activities: ['Trekking', 'Photography', 'Camping'],
        seasonality: 'Best: Jun-Sep',
        sensitivity: 'RESTRICTED',
        location_fuzzy: { lat: 25.5, lng: 94.0 },
        status: 'APPROVED'
    }
];

export const MOCK_BOOKINGS: Booking[] = [
    {
        id: 'b1',
        hotspot_id: '1',
        guest_id: 'g1',
        start_date: '2025-04-10',
        end_date: '2025-04-12',
        status: 'APPROVED',
        guest_count: 2
    },
    {
        id: 'b2',
        hotspot_id: '3',
        guest_id: 'g1',
        start_date: '2025-06-15',
        end_date: '2025-06-18',
        status: 'REQUESTED',
        guest_count: 4
    }
];
