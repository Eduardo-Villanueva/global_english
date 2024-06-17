"use client";

import { useEffect, useState } from "react";
import { formatDateLong, getDatesForWeekdays } from "@/app/utils/date";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Student } from "@/app/types/types";
import Loading from "@/app/components/Loading";
import { getStudentsByClass } from "@/app/utils/api/students";
import { getClassById } from "@/app/utils/api/classes";
import { Course } from "@prisma/client";

interface DayAssistanceProps {
	setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
	students: Student[];
}

const DayAssistance: React.FC<DayAssistanceProps> = ({
	students,
	setStudents,
}) => {
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>No</TableHead>
					<TableHead className='w-full'>Nombre</TableHead>
					<TableHead className='text-center'>Asistió</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{students.length > 0 &&
					students.map((student, idx) => (
						<TableRow key={student.id} className='h-[55px]'>
							<TableCell>{idx}</TableCell>
							<TableCell className=''>{student.fullname}</TableCell>
							<TableCell className='flex justify-center items-center'>
								<Checkbox className='h-8 w-8' />
							</TableCell>
						</TableRow>
					))}
			</TableBody>
		</Table>
	);
};

interface AssitanceProps {
	params: { slug: string };
}

export default function Page({ params }: AssitanceProps) {
	const { toast } = useToast();

	const today = new Date();
	const [selectedDate, setSelectedDate] = useState<string>("");
	const [availableDates, setAvailableDates] = useState<Date[]>([]);

	const [isLoading, setIsLoading] = useState(true);

	const [course, setCourse] = useState<Course>();
	const [students, setStudents] = useState<Student[]>([]);
	const [assistanceStudents, setAssistanceStudents] = useState<Student[]>([]);

	const fetchCourse = async () => {
		const course: Course = await getClassById(Number(params.slug));
		setCourse(course);

		if (!course) return;
		const dates = getDatesForWeekdays(
			new Date(course.startingDate),
			new Date(course.endingDate),
			course.weekdays
		);
		setAvailableDates(dates);

		setSelectedDate(firstDayAfterStaticDate(dates));
		setIsLoading(false);
	};

	const fetchStudents = async () => {
		const students: Student[] = await getStudentsByClass(Number(params.slug));
		setStudents(students);
	};

	// const fetchAssistance = async () => {
	// 	getAssistanceByClass(params.slug);
	// };

	useEffect(() => {
		fetchCourse();
		fetchStudents();
	}, []);

	function firstDayAfterStaticDate(dates: Date[]) {
		let index = 0;
		if (dates.includes(today)) {
			index = dates.findIndex((item) => item === today);
		} else if (dates.some((item) => item > today)) {
			index = dates.findIndex((item) => item > today);
		}
		return dates[index].toISOString();
	}

	return (
		<div className='flex flex-col w-full'>
			<Loading active={isLoading}>
				<Select
					value={selectedDate}
					onValueChange={(value) => setSelectedDate(value)}
				>
					<SelectTrigger className='w-[250px] bg-[#d9d9d9]'>
						<SelectValue
							placeholder={
								selectedDate
									? formatDateLong(new Date(selectedDate))
									: "Select a date"
							}
						/>
					</SelectTrigger>
					<SelectContent>
						{availableDates.map((date, index) => (
							<SelectItem key={index} value={date.toISOString()}>
								{formatDateLong(date)}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<ScrollArea className='w-full h-full my-4 '>
					<DayAssistance
						setStudents={setAssistanceStudents}
						students={students}
					/>
				</ScrollArea>
				<div className='flex justify-end'>
					<Button
						onClick={() => {
							toast({
								title: "Asistencia registrada",
								description: `La asistencia para el día ${formatDateLong(
									new Date(selectedDate)
								)}`,
							});
						}}
					>
						Guardar
					</Button>
				</div>
			</Loading>
		</div>
	);
}
