"use client";

import { useRouter } from "next/navigation";
import Class from "@/app/types/Class";
import { MoreVertical, UserCheck } from "react-feather";
import Tooltipped from "@/app/components/Tooltipped";

function capitalize(string: string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

function formatDate(date: string) {
	const dateObj = new Date(date);

	return capitalize(
		dateObj
			.toLocaleDateString("es-ES", { month: "short", year: "numeric" })
			.replace(".", "")
	);
}

const ClassCard: React.FC<Class> = ({ id, company, startingDate, endDate }) => {
	const router = useRouter();
	const handleClick = () => {
		router.push(`/dashboard/classes/${id}`);
	};

	return (
		<div className='w-80'>
			<div
				onClick={handleClick}
				className='hover:cursor-pointer text-2xl flex bg-white items-end h-20 rounded-t-lg'
			>
				<div className='m-3'>{company}</div>
			</div>
			<div className='flex p-4 justify-between items-center bg-primary text-white rounded-b-lg'>
				<div onClick={handleClick} className='hover:cursor-pointer'>
					{formatDate(startingDate)} - {formatDate(endDate)}
				</div>
				<div className='flex gap-2 '>
					<Tooltipped tooltip='Tomar Asistencia'>
						<UserCheck />
					</Tooltipped>
					<Tooltipped tooltip='Opciones'>
						<MoreVertical />
					</Tooltipped>
				</div>
			</div>
		</div>
	);
};

export default ClassCard;