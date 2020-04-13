const pillarData = require('./data.csv')
const _ = require('lodash')
require('./future.scss')
const Chart = require('chart.js')


// convert strings to ints
pillarData.forEach(row => _.forEach(['year', 'plasticMass', 'humanMass', 'population', 'plasticMassPerPopulation', 'plasticMassVs2020'], (key) => row[key] = parseFloat(row[key])));
// add population data to pillar data
// let populationDataDict = _.fromPairs(_.map(populationData, (r) => [r.year, parseInt(r.Population)]))
// pillarData.forEach(row => { row.population = populationDataDict[parseInt(row.year)]; })
// console.log(pillarData);


let startingYear = 2020;
let futurePillarData = _.filter(pillarData, (row) => row.year >= startingYear);
let plasticMass = _.map(futurePillarData, (row) => row.plasticMassVs2020);

// let yearlyPopulation = _.filter(populationData, (row) => parseInt(row.year) >= startingYear)
// let plasticMassPerPerson = _.map(plasticMass, (yearMass, index) => { yearMass /= parseInt(yearlyPopulation[index].Population)}


// console.log(plasticMassPerPerson);

class FuturePredictor {
    constructor(startingYear, massPerYear) {
        this.startingYear = startingYear;
        this.massPerYear = massPerYear;
        this.yearModifiers = []; // {year, modifierPct} amount
    }
    get modifiedMassPerYear() {
        let modifiedMassPerYear = _.clone(this.massPerYear);
        this.yearModifiers.forEach((modifier) => {
            for(var yearIndex = this.getIndexForYear(modifier.year); yearIndex < modifiedMassPerYear.length; yearIndex++) {
                modifiedMassPerYear[yearIndex] += modifiedMassPerYear[yearIndex] * modifier.multiplier;
            }
        })
        modifiedMassPerYear = _.map(modifiedMassPerYear, (mass) => mass.toFixed(4))
        return modifiedMassPerYear;
    }
    add(year, multiplier) {
        this.yearModifiers.push({year, multiplier})
        this.yearModifiers = _.sortBy(this.yearModifiers, 'year');
        if(this.chart) { this.updateChart(); }
        if(this.yearEls) { this.updateYearsMultipliers(); }
    }
    remove(year, multiplier) {
        this.yearModifiers = _.filter(this.yearModifiers, (modifier) => !_.isEqual(modifier, {year, multiplier}))
        if(this.chart) { this.updateChart(); }
        if(this.yearEls) { this.updateYearsMultipliers(); }
    }
    getIndexForYear(year) {
        return year - this.startingYear;
    }
    get years() {
        return _.times(this.massPerYear.length, (i) => i + this.startingYear)
    }
    generateChart(canvasEl) {
        // console.log(startingYear, plasticMass);
        var ctx = canvasEl.getContext('2d');
        this.chart = new Chart(ctx, {
            // The type of chart we want to create
            type: 'bar',

            // The data for our dataset
            data: {
                labels: this.years,
                datasets: [

                    {
                        label: 'With Action',
                        backgroundColor: '#1E7FAA',
                        // borderColor: 'rgb(255, 99, 132)',
                        data: this.modifiedMassPerYear
                    },
                    {
                        label: 'Predicted',
                        backgroundColor: '#F5E5C3',
                        // borderColor: 'rgb(255, 99, 132)',
                        data: this.massPerYear
                    },
 

                ]
            },

            // Configuration options go here
            options: {
                scales: {
                    xAxes: [
                        {
                            stacked: true,
                            gridLines: {
                                display: false
                            }
                        },
                    ],
                    yAxes: [{
                        ticks: {
                        // suggestedMin: 0,
                        callback: (value, index, values) => value + 'x' },
                        gridLines: {
                            // display: false
                        }
 
                    }]
                },
                legend: {
                    display: false
                },
           }
        });
        return this.chart;
    }
    updateChart(chart) {
        if(!chart) { chart = this.chart; }
        chart.data.datasets[0].data = predictor.modifiedMassPerYear;
        chart.data.datasets[1].data = predictor.massPerYear;
        chart.update()
    }
    updateYearsMultipliers(yearEls) {
        if(!yearEls) { yearEls = this.yearEls; }
        this.yearEls = yearEls;
        // predictor.updateYearsMultipliers(document.querySelectorAll('#content-container h2'));

        yearEls.forEach((el) => {
            let modifiedMass = parseFloat(this.modifiedMassPerYear[this.getIndexForYear(parseInt(el.innerText))])
            let modifiedMassPct = Math.round((modifiedMass - 1) * 100)
            el.dataset['multiplier'] = modifiedMassPct;
        })
    }
}

let predictor = new FuturePredictor(startingYear, plasticMass);
window.predictor = predictor;

// let chart = predictor.generateChart(document.getElementById('chart'))
// predictor.add(2025, -.05)
// predictor.add(2035, -.08)


// setTimeout(() => { predictor.add(2030, -.28) }, 1000)
// setTimeout(() => { predictor.remove(2030, -.28) }, 2000)
// setTimeout(() => { predictor.remove(2025, -.05) }, 3000)


// document.querySelectorAll('.wp-block-button__link').forEach((btnEl) => {
//     btnEl.addEventListener('click', (e) => {
//         e.preventDefault();
//         var btnData = JSON.parse(btnEl.rel)
//         var isActive = btnEl.classList.toggle('active');
//         if(isActive) {
//             window.predictor.add(btnData.year, btnData.modifier);
//         } else {
//             window.predictor.remove(btnData.year, btnData.modifier);
//         }
//     })
// })
