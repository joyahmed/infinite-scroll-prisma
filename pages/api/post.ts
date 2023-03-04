import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method === 'GET') {
		const limit = 5;
		const cursor = req.query.cursor ?? '';
		const cursorObj =
			cursor === '' ? undefined : { id: String(cursor) };
		const posts = await prisma.post.findMany({
			take: limit,
			cursor: cursorObj,
			skip: cursor === '' ? 0 : 1
		});
		return res.json({
			posts,
			nextId:
				posts.length === limit ? posts[limit - 1].id  : undefined
		});
	}
};

export default handler;
