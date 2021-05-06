import { useRef, useState } from 'react';

import '../styles/tasklist.scss';

import { FiTrash, FiCheckSquare, FiXSquare } from 'react-icons/fi';
import nextId, { setPrefix } from 'react-id-generator';

interface Task {
	id: number;
	title: string;
	isComplete: boolean;
}

export function TaskList() {
	const [tasks, setTasks] = useState<Task[]>([]);
	const [newTaskTitle, setNewTaskTitle] = useState('');
	const [errorMessages, setErrorMessages] = useState<string[]>([]);
	const titleInput = useRef<HTMLInputElement>(null);

	setPrefix('');

	function handleCreateNewTask() {
		// Crie uma nova task com um id random, não permita criar caso o título seja vazio.
		let errors = [] as Array<string>;

		if (newTaskTitle.trim().length == 0) {
			errors.push('O título precisa ser informado');
		} else if (handleDuplicatedTitle()) {
			errors.push('A tarefa já existe');
		}

		if (errors.length == 0) {
			const taskId = Number.parseInt(nextId());
			setTasks([...tasks, { id: taskId, title: newTaskTitle.trim(), isComplete: false }]);
			setNewTaskTitle('');
			if (titleInput.current) titleInput.current.focus();
			setErrorMessages([]);
		} else {
			setErrorMessages(errors);
		}
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

	function handleDuplicatedTitle() {
		return tasks.findIndex((task) => task.title == newTaskTitle.trim()) > -1;
	}

	return (
		<>
			<section className="task-list container">
				<div className="messages" style={{ display: errorMessages.length > 0 ? 'flex' : 'none' }}>
					<ul>
						{errorMessages.map((message) => {
							return <li>{message}</li>;
						})}
					</ul>

					<a href="#" onClick={() => setErrorMessages([])}>
						<FiXSquare className="closeIcon" />
					</a>
				</div>
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
		</>
	);
}
