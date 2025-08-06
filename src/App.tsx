import { useEffect, useRef, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { Database } from "./database.types";
import type { Player } from "./types";
import { Button } from "./components/ui/button";

function App() {
	const [players, setPlayers] = useState<Player[]>([]);
	const [manual, setManual] = useState({
		id: 0,
		state: false,
	});

	const supabase = useRef(
		createClient<Database>(
			"https://lbycgoekpwpuvtwdyrvh.supabase.co",
			"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxieWNnb2VrcHdwdXZ0d2R5cnZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyODMwNTAsImV4cCI6MjA2OTg1OTA1MH0.QLQm-BNkT4MNE9df_X_TwIwPpJiJNNPnDLFnPQTggns",
		),
	);

	const refetch = async () => {
		const { data } = await supabase.current.from("players").select("*");
		if (!data) return;
		const newData: Player[] = data
			.map((item) => {
				return {
					...item,
					matchDiff: Math.abs(item.win - item.lose),
					point: item.win * 3 + item.draw,
				};
			})
			.sort((a, b) => b.point - a.point);
		setPlayers(newData);
	};

	useEffect(() => {
		refetch();
	}, []);

	const handleWin = async (id: number, current: number, play: number) => {
		await supabase.current
			.from("players")
			.update({
				win: current + 1,
				play: play + 1,
			})
			.eq("id", id);

		refetch();
	};

	const handleLose = async (id: number, current: number, play: number) => {
		await supabase.current
			.from("players")
			.update({
				lose: current + 1,
				play: play + 1,
			})
			.eq("id", id);

		refetch();
	};

	const handleDraw = async (id: number, current: number, play: number) => {
		await supabase.current
			.from("players")
			.update({
				draw: current + 1,
				play: play + 1,
			})
			.eq("id", id);
		refetch();
	};

	return (
		<div className="flex h-screen items-center justify-center">
			<div className="w-[50%] space-y-2">
				<h2 className="font-bold text-center uppercase">
					brutal catur universe
				</h2>
				<h1 className="text-4xl font-bold text-center uppercase mb-5">
					sekak standings
				</h1>
				<Table className="font-bold">
					<TableCaption>A list of your recent invoices.</TableCaption>
					<TableHeader className="bg-secondary">
						<TableRow>
							<TableHead className="w-[100px] uppercase">pos</TableHead>
							<TableHead className="uppercase">nama</TableHead>
							<TableHead className="uppercase">pl</TableHead>
							<TableHead className="uppercase">w</TableHead>
							<TableHead className="uppercase">d</TableHead>
							<TableHead className="uppercase">l</TableHead>
							<TableHead className="uppercase">md</TableHead>
							<TableHead className="uppercase">pts</TableHead>
							<TableHead className="uppercase">action</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{players.map((player, index) => (
							<TableRow key={player.id}>
								<TableCell>{index + 1}</TableCell>
								<TableCell className="uppercase">{player.name}</TableCell>
								<TableCell>{player.play}</TableCell>
								<TableCell>{player.win}</TableCell>
								<TableCell>{player.draw}</TableCell>
								<TableCell>{player.lose}</TableCell>
								<TableCell>{player.matchDiff}</TableCell>
								<TableCell>{player.point}</TableCell>
								<TableCell className="flex gap-2">
									<Button
										className="uppercase"
										onClick={() =>
											handleWin(player.id, player.win, player.play)
										}
									>
										win
									</Button>
									<Button
										className="uppercase"
										variant={"outline"}
										onClick={() =>
											handleDraw(player.id, player.draw, player.play)
										}
									>
										draw
									</Button>
									<Button
										className="uppercase"
										variant={"destructive"}
										onClick={() =>
											handleLose(player.id, player.lose, player.play)
										}
									>
										lose
									</Button>
									<Button
										className="uppercase"
										variant={"secondary"}
										onClick={() =>
											handleLose(player.id, player.lose, player.play)
										}
									>
										manual
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}

export default App;
