const ElementWarningAboutResolution = `<div class="toSmallResolution">
    <h1>Za mała rozdzielczość! 
    </br>
    Wymagana: powyżej 900px
    </h1>
  </div>`;

function changingToTheTooLowResolution(tooLowResolution) {
  if (tooLowResolution.matches) {
    document.body.innerHTML = ElementWarningAboutResolution;
  }
}

function changingToTheGoodResolution(goodResolution) {
  if (goodResolution.matches) {
    document.body.innerHTML = `
      <div class="puzzle">
      
      </div>

      <div class="board">
        <div class="cell"></div>
        <div class="cell"></div>
        <div class="cell"></div>
          
        <div class="cell"></div>
        <div class="cell"></div>
        <div class="cell"></div>
          
        <div class="cell"></div>
        <div class="cell"></div>
        <div class="cell"></div>
      </div>

      <button class="playAgain">Losuj puzzle</button>
    `;

    const puzzle = document.querySelector(".puzzle");
    const btnPlayAgain = document.querySelector(".playAgain");
    const randomNumberForFolderWithPhotos = Math.floor(Math.random() * 2 + 1);

    function putThePicturesInRandomOrder() {
      let photoNumbers = [];

      while (photoNumbers.length < 9) {
        let randomNumberForPhoto = Math.floor(Math.random() * 9 + 1);
        photoNumbers.push(randomNumberForPhoto);
        photoNumbers = photoNumbers.filter(
          (item, index, array) => array.indexOf(item) === index
        );
      }

      for (let i = 0; i < photoNumbers.length; i++) {
        const img = document.createElement("img");
        img.src = `img/${randomNumberForFolderWithPhotos}/${photoNumbers[i]}.png`;
        img.classList.add("part");
        puzzle.appendChild(img);
      }

      const imgs = [...document.querySelectorAll("img")];

      for (let i = 0; i < imgs.length; i++) {
        imgs[i].style.transition = "all 0s";
        imgs[i].style.padding = "5px";
      }
    }

    putThePicturesInRandomOrder();

    const part = [...document.querySelectorAll(".part")];
    const cell = [...document.querySelectorAll(".cell")];

    let partPuzzle;
    let cellContents;

    puzzle.addEventListener("dragover", dragOver);
    puzzle.addEventListener("dragenter", dragEnter);
    puzzle.addEventListener("drop", dragDrop);

    function dragOver(e) {
      e.preventDefault();
    }

    function dragEnter(e) {
      e.preventDefault();
    }

    function dragDrop(e) {
      const isDroppedOnImg = e.target.classList.contains("part");
      if (
        this.contains(partPuzzle) ||
        partPuzzle == undefined ||
        isDroppedOnImg
      ) {
        return;
      } else {
        this.appendChild(partPuzzle);
      }
    }

    function pDragStart() {
      partPuzzle = this;
      setTimeout(() => {
        this.className = "invisible";
      }, 0);
    }

    function pDragDrop() {
      if (partPuzzle != undefined) {
        let cell1 = partPuzzle.parentElement;
        let cell2 = this.parentElement;
        if (
          cell1.classList.contains("puzzle") &&
          !cell2.classList.contains("puzzle")
        ) {
          partPuzzle.replaceWith(this);
        }
        if (
          cell2.classList.contains("puzzle") &&
          !cell1.classList.contains("puzzle")
        ) {
          const puzzleCell = partPuzzle.parentElement;
          this.replaceWith(partPuzzle);
          puzzleCell.appendChild(this);
        }
        if (
          cell1.classList.contains("cell") &&
          cell2.classList.contains("cell")
        ) {
          partPuzzle.replaceWith(this);
        }
      }
    }

    function pDragEnd() {
      this.className = "part";
    }

    part.forEach((p) => {
      p.addEventListener("dragstart", pDragStart);
      p.addEventListener("drop", pDragDrop);
      p.addEventListener("dragend", pDragEnd);
    });

    function cDragOver(e) {
      e.preventDefault();
    }

    function cDragEnter(e) {
      e.preventDefault();
    }

    function cDragDrop() {
      cellContents = this.innerHTML;
      if (partPuzzle != undefined && !cellContents) {
        this.appendChild(partPuzzle);
      } else {
        return;
      }
      checkWin();
    }

    cell.forEach((c) => {
      c.addEventListener("dragover", cDragOver);
      c.addEventListener("dragenter", cDragEnter);
      c.addEventListener("drop", cDragDrop);
    });

    function checkWin() {
      if (cell.every((c) => c.hasChildNodes())) {
        if (
          cell.every(
            (c, i) =>
              cell[i].children[0].getAttribute("src") ==
              `img/${randomNumberForFolderWithPhotos}/${i + 1}.png`
          )
        ) {
          endGame();
        }
      }
    }

    function endGame() {
      puzzle.removeEventListener("dragover", dragOver);
      puzzle.removeEventListener("dragenter", dragEnter);
      puzzle.removeEventListener("drop", dragDrop);

      part.forEach((p) => {
        p.removeEventListener("drop", pDragDrop);
      });

      cell.forEach((c) => {
        c.removeEventListener("dragover", cDragOver);
        c.removeEventListener("dragenter", cDragEnter);
        c.removeEventListener("drop", cDragDrop);
      });

      const imgs = [...document.querySelectorAll("img")];

      setTimeout(() => {
        for (let i = 0; i < cell.length; i++) {
          cell[i].style.transition = "all 2s";
          cell[i].style.border = "0px";
          cell[i].style.margin = "0px";
          cell[i].style.width = "265px";
          cell[i].style.height = "149.0625px";
        }

        for (let i = 0; i < imgs.length; i++) {
          imgs[i].style.transition = "all 2s";
          imgs[i].style.padding = "0px";
        }
      }, 2500);

      setTimeout(() => {
        btnPlayAgain.style.display = "block";
      }, 3500);

      btnPlayAgain.addEventListener("click", refreshGame);
    }

    function refreshGame() {
      window.location.reload();
    }
  }
}

let tooLowResolution = window.matchMedia("(max-width: 900px)");
let goodResolution = window.matchMedia("(min-width: 901px)");
changingToTheTooLowResolution(tooLowResolution);
changingToTheGoodResolution(goodResolution);
tooLowResolution.addListener(changingToTheTooLowResolution);
goodResolution.addListener(changingToTheGoodResolution);
