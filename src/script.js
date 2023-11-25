document.addEventListener("DOMContentLoaded", function () {
    const heatmapContainer = document.getElementById("heatmap-container");
    const popupContainer = document.getElementById("popup-container");
    const popupContent = document.getElementById("popup-content");

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let currentYear = 1993;
    const gridSize = 30;

    // Function to get the number of days in a month
    function getDaysInMonth(month, year) {
        return new Date(year, months.indexOf(month) + 1, 0).getDate();
    }

    //start from Sep
    let start = 8;
    const totalCells = gridSize * gridSize;
    let markedCells = 0;

    // Generate the heatmap table
    for (let i = 0; i < gridSize; i++) {
        const row = heatmapContainer.insertRow();

        for (let j = 0; j < gridSize; j++) {
            const cell = row.insertCell();
            const month = months[(start + i * gridSize + j) % 12];
            const year = currentYear + Math.floor((start + i * gridSize + j) / 12);
            cell.setAttribute("data-month", month);
            cell.setAttribute("data-year", year);
            cell.classList.add("cell");
            cell.addEventListener("click", function () {
                updatePopupRight(month, year);
            });

            const currentDate = new Date();
            const lastDayOfMonth = new Date(year, months.indexOf(month), getDaysInMonth(month, year));
            // If all days of the month have passed, mark the cell as light green
            if (lastDayOfMonth < currentDate) {
                cell.classList.add("passed-day");
                markedCells++;
            }

            // Add a border to the cell if it belongs to the current year
            if (year === new Date().getFullYear()) {
                cell.classList.add("current-year-cell");
                // Add the text of the month with two digits to the cell
                const monthIndex = months.indexOf(month) + 1;
                const formattedMonth = monthIndex < 10 ? `0${monthIndex}` : monthIndex;
                const textSpan = document.createElement("span");
                const abbreviatedMonth = month.substring(0, 3);
                // textSpan.textContent = formattedMonth;
                textSpan.textContent = abbreviatedMonth;
                cell.appendChild(textSpan);
            }
        }
    }

    let p_cent = Math.floor((markedCells / totalCells) * 100);
    // document.title += ` - ${p_cent}`;

    // Generate the popup table for the current month
    const currentMonth = months[new Date().getMonth()];
    currentYear = new Date().getFullYear();
    updatePopupRight(currentMonth, currentYear);

    // Function to update the popup on the right
    function updatePopupRight(selectedMonth, selectedYear) {
        const daysInCurrentMonth = getDaysInMonth(selectedMonth, selectedYear);

        const popupContainerCurrentMonth = document.createElement("div");
        popupContainerCurrentMonth.classList.add("popup-current-month");
        document.body.appendChild(popupContainerCurrentMonth);

        // Position the popup container to the right of the big table
        const heatmapContainerRect = heatmapContainer.getBoundingClientRect();
        popupContainerCurrentMonth.style.left = `${heatmapContainerRect.right + 50}px`; // Adjust the spacing as needed
        popupContainerCurrentMonth.style.top = `${heatmapContainerRect.top}px`;

        const titleCurrentMonth = document.createElement("div");
        titleCurrentMonth.classList.add("popup-title");
        titleCurrentMonth.textContent = `${selectedMonth} ${selectedYear}`;
        popupContainerCurrentMonth.appendChild(titleCurrentMonth);

        const tableCurrentMonth = document.createElement("table");
        popupContainerCurrentMonth.appendChild(tableCurrentMonth);

        const numOfWeeks = Math.ceil(daysInCurrentMonth / 7);
        let dayCounter = 1;
        markedDays = 0;
        for (let i = 0; i < numOfWeeks; i++) {
            const row = tableCurrentMonth.insertRow();

            for (let j = 0; j < 7; j++) {
                if (dayCounter > daysInCurrentMonth) {
                    break;
                }

                const cell = row.insertCell();
                cell.classList.add("cell");
                cell.textContent = dayCounter;

                const currentDate = new Date();
                const selectedDate = new Date(selectedYear, months.indexOf(selectedMonth), dayCounter);

                // Mark the cell as light green if the date is older than today
                if (selectedDate < currentDate) {
                    cell.classList.add("passed-day");
                    cell.classList.add("marked-cell");
                    markedDays++;
                }

                dayCounter++;
            }
        }
        percent = Math.floor((markedDays / daysInCurrentMonth) * 100);
        let abbreviatedMonth = selectedMonth.substring(0, 3);
        const popupTitle = `${abbreviatedMonth} ${selectedYear} - ${percent}%`;
        titleCurrentMonth.textContent = popupTitle;
    }

    // Create and append the SVG logo
    const logoContainer = document.getElementById("logo");
    const svgLogo = createSvgLogo(75, p_cent); // Adjust the size as needed
    logoContainer.appendChild(svgLogo);

    // Function to create the SVG logo
    function createSvgLogo(size, percentage) {
        const svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute("width", size);
        svg.setAttribute("height", size);

        // Create a background circle
    const backgroundCircle = document.createElementNS(svgNS, "circle");
    backgroundCircle.setAttribute("cx", "50%");
    backgroundCircle.setAttribute("cy", "50%");
    backgroundCircle.setAttribute("r", "30%");
    backgroundCircle.setAttribute("fill", "#688f4e"); // Background color
    svg.appendChild(backgroundCircle);

        // Create text element
        const text = document.createElementNS(svgNS, "text");
        text.setAttribute("x", "50%");
        text.setAttribute("y", "50%");
        text.setAttribute("dominant-baseline", "middle");
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("font-size", "16");
        text.setAttribute("fill", "#fff");
        text.textContent = `${percentage}%`;

        // Append text to SVG
        svg.appendChild(text);

        return svg;
    }

    // Show the popup with day grid
    function showPopup() {
        popupContainerCurrentMonth.style.display = "none";
        const month = this.getAttribute("data-month");
        const year = this.getAttribute("data-year");

        const daysInMonth = getDaysInMonth(month, year);

        popupContent.innerHTML = ""; // Clear previous content

        // Create title
        const title = document.createElement("div");
        title.classList.add("popup-title");
        title.textContent = `${month} ${year}`;
        popupContent.appendChild(title);

        const numOfWeeks = Math.ceil(daysInMonth / 7);

        let markedDays = 0;

        const table = document.createElement("table");

        for (let i = 0; i < numOfWeeks; i++) {
            const row = table.insertRow();

            for (let j = 0; j < 7; j++) {
                const day = i * 7 + j + 1;
                if (day > daysInMonth) break;

                const cell = row.insertCell();
                cell.classList.add("cell");
                const formattedDay = day.toString().padStart(2, "0");
                cell.textContent = formattedDay;

                const currentDate = new Date();
                const selectedDate = new Date(year, months.indexOf(month), day);
                const formattedDate = formatDate(selectedDate);

                // Attach the date to the cell
                cell.setAttribute("data-date", formattedDate);

                // Mark the cell as light green if the date is older than today
                if (selectedDate < currentDate) {
                    cell.classList.add("passed-day");
                    markedDays++;
                }
            }
        }

        popupContent.appendChild(table);
        popupContainer.style.display = "block";

        // Check if all cells in the popup are marked as passed-day
        const allCellsMarked = Array.from(table.querySelectorAll(".cell")).every(cell => cell.classList.contains("passed-day"));

        let percent = Math.floor((markedDays / daysInMonth) * 100);
        const popupTitle = `${month} ${year} - ${percent}%`;
        title.textContent = popupTitle;

        if (allCellsMarked) {
            // Mark the corresponding cell in the big table as light green
            const bigTableCell = document.querySelector(`#heatmap-container [data-month="${month}"][data-year="${year}"]`);
            if (bigTableCell) {
                bigTableCell.classList.add("passed-day");
            }
        }
    }


    // Function to format a date as YYYY-MM-DD
    function formatDate(date) {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");
        return `${year}-${month}-${day}`;
    }



    // // Close the popup
    window.closePopup = function () {
        popupContainer.style.display = "none";
        popupContainerCurrentMonth.style.display = "block";
    };

});