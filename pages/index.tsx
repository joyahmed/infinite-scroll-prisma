import styles from '@/styles/Home.module.css';
import axios from 'axios';
import Head from 'next/head';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useInfiniteQuery } from 'react-query';

export default function Home() {
	const { ref, inView } = useInView();
	const {
		isLoading,
		isError,
		data,
		error,
		isFetchingNextPage,
		fetchNextPage,
		hasNextPage
	} = useInfiniteQuery(
		'posts',
		async ({ pageParam = '' }) => {
			await new Promise(resolve => setTimeout(resolve, 300));
			const res = await axios.get('/api/post?cursor=' + pageParam);
			return res.data;
		},
		{
			getNextPageParam: lastPage => lastPage.nextId ?? false
		}
	);

	useEffect(() => {
		if (inView && hasNextPage) {
			fetchNextPage();
		}
	}, [inView, hasNextPage, fetchNextPage]);

	if (isLoading) return <div>Loading...</div>;
	if (isError) return <div>Error!</div>;
	return (
		<div className='flex flex-col items-center justify-center min-h-screen w-screen text-white bg-black'>
			{data &&
				data.pages.map(page => (
					<div
						className='flex flex-col items-center justify-center space-y-8 my-10 w-full'
						key={page.nextId ?? 'lastPage'}
					>
						{page.posts.map(
							(
								post: {
									id: string;
									title: string;
									createdAt: string;
								},
								index: number
							) => (
								<div
									className='flex flex-col  bg-gray-900 rounded-lg p-5 w-full md:w-1/3'
									key={post.id}
								>
									<p>{index + 1}</p>
									<p>{post.title}</p>
									<p>{post.createdAt}</p>
								</div>
							)
						)}
					</div>
				))}
			{isFetchingNextPage && <div>Loading...</div>}
			<span ref={ref} className={`scale-0 `}>
				Intersection Observer Marker
			</span>
		</div>
	);
}
