import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Función auxiliar simulada para envío de correos
async function sendEmailNotification(ticketId: string, companyId: string) {
  return new Promise((resolve) => {
    // TODO: replace with email service (SendGrid, Resend, etc.)
    console.info('[notifications] urgent ticket resolved', { ticketId, companyId })
    resolve(undefined)
  })
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { status } = await request.json()

  const ticket = await prisma.ticket.findUnique({ where: { id } })

  if (!ticket) return NextResponse.json({ error: 'Ticket no encontrado' }, { status: 404 })

  if (ticket.priority === 'Urgente' && status === 'Resuelto')
    await sendEmailNotification(ticket.id, ticket.companyId)

  const updatedTicket = await prisma.ticket.update({
    where: { id },
    data: { status },
  })

  return NextResponse.json(updatedTicket)
}
