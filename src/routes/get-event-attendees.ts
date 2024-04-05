import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function getEventAttendees(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/events/:eventId/attendees",
    {
      schema: {
        summary: "Get event attendees",
        tags: ["events"],
        params: z.object({
          eventId: z.string().uuid(),
        }),
        querystring: z.object({
          name: z.string().nullish(),
          page: z.string().nullish().default("1").transform(Number),
        }),
        response: {
          200: z.object({
            attendees: z.array(
              z.object({
                id: z.number(),
                name: z.string(),
                email: z.string().email(),
                createdAt: z.date(),
                checkedInAt: z.date().nullable(),
              })
            ),
            total: z.number(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { eventId } = request.params;
      const { page, name } = request.query;

      const pageIndex = page ? page - 1 : 0;

      const where = name
        ? {
            eventId,
            name: {
              contains: name,
            },
          }
        : {
            eventId,
          };

      const [attendees, total] = await Promise.all([
        prisma.attendee.findMany({
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
            checkIn: {
              select: {
                createdAt: true,
              },
            },
          },
          where,
          take: 10,
          skip: pageIndex * 10,
          orderBy: {
            createdAt: "desc",
          },
        }),

        prisma.attendee.count({
          where,
        }),
      ]);

      return reply.send({
        attendees: attendees.map((attendee) => {
          return {
            id: attendee.id,
            name: attendee.name,
            email: attendee.email,
            createdAt: attendee.createdAt,
            checkedInAt: attendee.checkIn?.createdAt ?? null,
          };
        }),
        total,
      });
    }
  );
}
