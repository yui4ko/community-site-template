/**
 * Sample content for a fresh database.
 *
 *   npm run seed
 *
 * The admin user is NOT created here — it is created on the first successful
 * sign-in with the ADMIN_EMAIL / ADMIN_PASSWORD from your .env (see src/auth.ts).
 * The seed is a no-op once any event exists, so it is safe to re-run.
 */
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Seeding sample content...')

    const existing = await prisma.event.count()
    if (existing > 0) {
        console.log(`ℹ️  ${existing} event(s) already present — skipping seed.`)
        return
    }

    const now = new Date()
    const inThreeWeeks = new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000)
    const threeWeeksAgo = new Date(now.getTime() - 21 * 24 * 60 * 60 * 1000)

    await prisma.event.create({
        data: {
            title: 'SAMPLE — Upcoming Tech Talk',
            description: '<p>Replace this event from the admin dashboard. It shows how an upcoming talk appears on the home page and the events list.</p>',
            abstract: 'A short abstract shows up in the cards and in the "Next Event" panel.',
            date: inThreeWeeks,
            type: 'tech_talk',
            status: 'upcoming',
            deliveryMethod: 'online',
            location: 'Zoom',
            speaker: 'Speaker name — edit in Admin',
            speakerTitle: 'Job title',
            speakerBio: 'A couple of sentences about the speaker.',
        },
    })

    await prisma.event.create({
        data: {
            title: 'SAMPLE — Past Get-Together',
            description: '<p>Past events keep their photo gallery, slides, and recording link so the site doubles as an archive.</p>',
            date: threeWeeksAgo,
            type: 'get_together',
            status: 'past',
            deliveryMethod: 'onsite',
            location: 'Community Hall',
            address: '123 Main St',
        },
    })
    console.log('✅ Created sample events')

    await prisma.news.create({
        data: {
            title: 'SAMPLE — Welcome to your new site',
            content: '<p>Sign in at <code>/admin</code> to replace this post, add events, and change the colours and copy under Theme Settings.</p>',
            excerpt: 'Sign in at /admin to start replacing the sample content.',
            publishDate: now,
        },
    })
    console.log('✅ Created sample news')

    await prisma.announcement.create({
        data: {
            title: 'SAMPLE — Announcement banner',
            description: 'Shows across the top of the home page while it is active.',
            linkUrl: '/events',
            linkText: 'See events',
            isActive: false,
            type: 'info',
        },
    })
    console.log('✅ Created sample announcement (inactive — enable it in Admin)')

    console.log('✨ Done. Sign in at /admin with ADMIN_EMAIL / ADMIN_PASSWORD to replace this content.')
}

main()
    .catch((e: Error) => {
        console.error('Error seeding database:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
