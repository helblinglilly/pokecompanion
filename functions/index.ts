export const onRequest: PagesFunction<Env> = async (context) => {
	return new Response(JSON.stringify({ hello: 'world' }));
};
