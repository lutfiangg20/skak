import { Input } from "./ui/input";

type Props = {
	value: number;
	manualValue: number;
	onChange: (value: number) => void;
	className?: string;
	manual: number;
	id: number;
};

const CustomInput = ({
	value,
	manualValue,
	onChange,
	className,
	manual,
	id,
}: Props) => {
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const val = e.target.value;

		// biar kosong juga valid (supaya bisa hapus angka)
		if (val === "") {
			onChange(0);
			return;
		}

		// regex: hanya angka (dan minus kalau diizinkan)
		const regex = /^\d*$/;

		if (regex.test(val)) {
			const num = Number(val);
			if (!Number.isNaN(num)) {
				onChange(num);
			}
		}
	};
	return manual === id ? (
		<Input
			className={`${className}`}
			value={manualValue}
			onChange={handleChange}
		/>
	) : (
		value
	);
};

export default CustomInput;
