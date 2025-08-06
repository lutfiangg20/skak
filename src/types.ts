export type Player = {
	created_at: string;
	draw: number;
	id: number;
	lose: number;
	name: string;
	play: number;
	win: number;
	matchDiff: number;
	point: number;
};

export type EditPlayer = {
	draw: number;
	lose: number;
	play: number;
	win: number;
};
