import { useRef, useState } from 'react';

import '../styles/tasklist.scss';

import { FiTrash, FiCheckSquare } from 'react-icons/fi';
import nextId, { setPrefix } from 'react-id-generator';


interface Task {
	id: number;
	title: string;
	isComplete: boolean;
}

export function TaskList() {
	const [tasks, setTasks] = useState<Task[]>([]);
	const [newTaskTitle, setNewTaskTitle] = useState('');
	const titleInput = useRef<HTMLInputElement>(null);

	setPrefix('');

	function handleCreateNewTask() {
		// Crie uma nova task com um id random, não permita criar caso o título seja vazio.
		const taskId = Number.parseInt(nextId());
		setTasks([...tasks, { id: taskId, title: newTaskTitle, isComplete: false }]);
		setNewTaskTitle('');
		if (titleInput.current) titleInput.current.focus();
	}

	function handleToggleTaskCompletion(idSearch: number) {
		let newArray = tasks.map((oldTask) => {
			if (oldTask.id == idSearch) {
				return { id: idSearch, isComplete: oldTask.isComplete ? false : true, title: oldTask.title } as Task;
			}
			return oldTask;
		});
		setTasks(newArray);
		// Altere entre `true` ou `false` o campo `isComplete` de uma task com dado ID
	}

	function handleRemoveTask(id: number) {
		let newArray = tasks.filter((task) => task.id != id);
		setTasks(newArray);
	}

	return (
		<section className="task-list container">
			<header>
				<h2>Minhas tasks</h2>

				<div className="input-group">
					<input
						ref={titleInput}
						type="text"
						placeholder="Adicionar novo todo"
						onChange={(e) => setNewTaskTitle(e.target.value)}
						onKeyPress={(e) => (e.key == 'Enter' ? handleCreateNewTask() : null)}
						value={newTaskTitle}
					/>
					<button type="submit" data-testid="add-task-button" onClick={handleCreateNewTask}>
						<FiCheckSquare size={16} color="#fff" />
					</button>
				</div>
			</header>

			<main>
				<ul>
					{tasks.map((task) => (
						<li key={task.id}>
							<div className={task.isComplete ? 'completed' : ''} data-testid="task">
								<label className="checkbox-container">
									<input
										type="checkbox"
										readOnly
										checked={task.isComplete}
										onClick={() => handleToggleTaskCompletion(task.id)}
									/>
									<span className="checkmark"></span>
								</label>
								<p>{task.title}</p>
							</div>

							<button
								type="button"
								data-testid="remove-task-button"
								onClick={() => handleRemoveTask(task.id)}
							>
								<FiTrash size={16} />
							</button>
						</li>
					))}
				</ul>
			</main>
		</section>
	);
}
