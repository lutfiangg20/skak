import { useEffect, useRef, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Check, CircleX } from "lucide-react";
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
import type { EditPlayer, Player } from "./types";
import { Button } from "./components/ui/button";
import CustomInput from "./components/CustomInput";

function App() {
	const supabase = useRef(
		createClient<Database>(
			"https://lbycgoekpwpuvtwdyrvh.supabase.co",
			"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxieWNnb2VrcHdwdXZ0d2R5cnZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyODMwNTAsImV4cCI6MjA2OTg1OTA1MH0.QLQm-BNkT4MNE9df_X_TwIwPpJiJNNPnDLFnPQTggns",
		),
	);
	const [players, setPlayers] = useState<Player[]>([]);
	const [manual, setManual] = useState(0);
	const [formData, setFormData] = useState<EditPlayer>({
		win: 0,
		lose: 0,
		draw: 0,
		play: 0,
	});

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

		const channel = supabase.current
			.channel("public:messages")
			.on(
				"postgres_changes",
				{
					event: "*",
					schema: "public",
					table: "players",
				},
				(payload) => {
					console.log("Payload:", payload);
					if (
						payload.eventType === "UPDATE" ||
						payload.eventType === "INSERT"
					) {
						refetch();
					}
				},
			)
			.subscribe();

		return () => {
			supabase.current.removeChannel(channel);
		};
	}, []);

	const handleWin = async (id: number, current: number, play: number) => {
		await supabase.current
			.from("players")
			.update({
				win: current + 1,
				play: play + 1,
			})
			.eq("id", id);

		// refetch();
	};

	const handleLose = async (id: number, current: number, play: number) => {
		await supabase.current
			.from("players")
			.update({
				lose: current + 1,
				play: play + 1,
			})
			.eq("id", id);

		// refetch();
	};

	const handleDraw = async (id: number, current: number, play: number) => {
		await supabase.current
			.from("players")
			.update({
				draw: current + 1,
				play: play + 1,
			})
			.eq("id", id);
		// refetch();
	};

	const handleManual = async (id: number) => {
		const find = players.find((player) => player.id === id);
		if (!find) return;
		setFormData({
			win: find.win,
			lose: find.lose,
			draw: find.draw,
			play: find.play,
		});
		setManual(id);
	};

	const handleSubmitManual = async () => {
		await supabase.current
			.from("players")
			.update({
				win: formData.win,
				lose: formData.lose,
				draw: formData.draw,
				play: formData.play,
			})
			.eq("id", manual);
		// refetch();
		setManual(0);
	};

	return (
		<div className="flex h-screen items-center justify-center">
			<div className="w-fit space-y-2">
				<h2 className="font-bold text-center uppercase">
					brutal catur universe
				</h2>
				<h1 className="text-4xl font-bold text-center uppercase mb-5">
					sekak standings
				</h1>
				<Table className="font-bold">
					<TableCaption>A list of players</TableCaption>
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
								<TableCell>
									<CustomInput
										className="w-12"
										id={player.id}
										manual={manual}
										manualValue={formData.play}
										value={player.play}
										onChange={(value) =>
											setFormData({ ...formData, play: value })
										}
									/>
								</TableCell>
								<TableCell>
									<CustomInput
										className="w-12"
										id={player.id}
										manual={manual}
										manualValue={formData.win}
										value={player.win}
										onChange={(value) =>
											setFormData({ ...formData, win: value })
										}
									/>
								</TableCell>
								<TableCell>
									<CustomInput
										className="w-12"
										id={player.id}
										manual={manual}
										manualValue={formData.draw}
										value={player.draw}
										onChange={(value) =>
											setFormData({ ...formData, draw: value })
										}
									/>
								</TableCell>
								<TableCell>
									<CustomInput
										className="w-12"
										id={player.id}
										manual={manual}
										manualValue={formData.lose}
										value={player.lose}
										onChange={(value) =>
											setFormData({ ...formData, lose: value })
										}
									/>
								</TableCell>
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
									{player.id !== manual ? (
										<Button
											className="uppercase"
											variant={"secondary"}
											onClick={() => handleManual(player.id)}
										>
											manual
										</Button>
									) : (
										<div className="flex gap-2">
											<Button
												onClick={() => setManual(0)}
												variant={"destructive"}
											>
												<CircleX />
											</Button>
											<Button onClick={handleSubmitManual}>
												<Check />
											</Button>
										</div>
									)}
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
