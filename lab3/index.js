function Game() {
    alert("Начать игру «Подкинь монетку»!");

    let userChoice;

    while (true) {
        userChoice = prompt("Введи: 1 - орёл или 2 - решка");

        if (userChoice === null) {
            alert("Игра прервана пользователем.");
            return;
        }

        userChoice = userChoice.trim();

        if (userChoice === "") {
            alert("Ошибка: нельзя оставлять поле пустым.");
            continue;
        }

        if (userChoice !== "1" && userChoice !== "2") {
            alert("Ошибка: нужно ввести только 1 или 2.");
            continue;
        }

        if (userChoice === "1") {
            userChoice = "орёл";
        }
		
		if (userChoice === "2") {
            userChoice = "решка";
        }
		
        break;
    }

    let randomNumber = Math.random();
    
	let result;
	
    if (randomNumber < 0.48) {
        result = "орёл";
    } else if (randomNumber > 0.52) {
        result = "решка";
    } else {
        result = "ребро";
    }

    alert("Монетка подброшена...");

    if (userChoice === result) {
        alert("Выпало: " + result + "\nТы угадал! Победа!");
    } else {
        alert("Выпало: " + result + "\nТы не угадал.");
    }

    let playAgain = confirm("Хочешь сыграть ещё раз?");

    if (playAgain) {
        Game();
	}
}