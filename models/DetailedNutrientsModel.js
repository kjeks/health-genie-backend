const mongoose = require('mongoose');

let DetailedNutrientsSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    vann: Number,
    fett: {
        flerumettet: Number,
        enumettet: Number,
        mettet: Number,
        omega3: Number,
        omega6: Number,
        trans: Number
    },
    karbohydrater: {
        stivelse: Number,
        monoDisakk: Number,
        kostFiber: Number
    },
    vitaminer: {
        A: Number,
        D: Number,
        E: Number,
        B6: Number,
        B12: Number,
        C: Number,
        folat: Number,
        niacin: Number,
        riboflavin: Number,
        tiamin: Number,
        betaKaroten: Number,
        retinol: Number
    },
    mineraler: {
        jod: Number,
        fosFor: Number,
        kopper: Number,
        selen: Number,
        sink: Number,
        magnesium: Number,
        kalium: Number,
        natrium: Number,
        jern: Number,
        kalsium: Number
    }
});

let DetailedNutrients = mongoose.model('DetailedNutrients', DetailedNutrientsSchema);

module.exports = {
    createDetailedNutrients(nutrients) {
        return new DetailedNutrients({
            _id: new mongoose.Types.ObjectId(),
            vann: nutrients.get('Vann'),
            fett: {
                flerumettet: nutrients.get('Flerumettet'),
                enumettet: nutrients.get('Enumettet'),
                mettet: nutrients.get('Mettet'),
                omega3: nutrients.get('Omega-3'),
                omega6: nutrients.get('Omega-6'),
                trans: nutrients.get('Trans')
            },
            karbohydrater: {
                stivelse: nutrients.get('Stivelse'),
                monoDisakk: nutrients.get('Mono+disakk'),
                kostfiber: nutrients.get('Kostfiber')
            },
            vitaminer: {
                A: nutrients.get('Vitamin A'),
                D: nutrients.get('Vitamin D'),
                E: nutrients.get('Vitamin E'),
                B6: nutrients.get('Vitamin B6'),
                B12: nutrients.get('Vitamin B12'),
                C: nutrients.get('Vitamin C'),
                folat: nutrients.get('Folat'),
                niacin: nutrients.get('Niacin'),
                riboflavin: nutrients.get('Riboflavin'),
                tiamin: nutrients.get('Tiamin'),
                betaKaroten: nutrients.get('Beta-karoten'),
                retinol: nutrients.get('Retinol')
            },
            mineraler: {
                jod: nutrients.get('Jod'),
                fosfor: nutrients.get('Fosfor'),
                kopper: nutrients.get('Kopper'),
                selen: nutrients.get('Selen'),
                sink: nutrients.get('Sink'),
                magnesium: nutrients.get('Magnesium'),
                kalium: nutrients.get('Kalium'),
                natrium: nutrients.get('Natrium'),
                jern: nutrients.get('Jern'),
                kalsium: nutrients.get('Kalsium')
            }
        }).save();
    },
    createFromIdAndQuantity: function (items) {
        let updatedValues = [];
        items.forEach(item => {
            const id = item[0];
            const quantity = item[1];
            updatedValues.push(new Promise(resolve => {
                return DetailedNutrients.findOne({_id: id}).then(detailedNutrient => {
                    const updatedFat = ObjectMap(detailedNutrient.fett, function (value) {
                        return value * quantity / 100;
                    });
                    const updatedMinerals = ObjectMap(detailedNutrient.mineraler, function (value) {
                        return value * quantity / 100;
                    });
                    const updatedVitamins = ObjectMap(detailedNutrient.vitaminer, function (value) {
                        return value * quantity / 100;
                    });
                    const updatedCarbs = ObjectMap(detailedNutrient.karbohydrater, function (value) {
                        return value * quantity / 100;
                    });
                    resolve({
                        fat: updatedFat,
                        minerals: updatedMinerals,
                        vitamins: updatedVitamins,
                        carbs: updatedCarbs
                    })
                });
            }))
        });
        return Promise.all(updatedValues).then(nutrients => {
            let summedNutrients = {
                fett: {
                    flerumettet: 0,
                    enumettet: 0,
                    mettet: 0,
                    omega3: 0,
                    omega6: 0,
                    trans: 0
                },
                karbohydrater: {
                    stivelse: 0,
                    monoDisakk: 0,
                    kostFiber: 0
                },
                vitaminer: {
                    //A: 0,
                    D: 0,
                    E: 0,
                    B6: 0,
                    B12: 0,
                    C: 0,
                    folat: 0,
                    niacin: 0,
                    riboflavin: 0,
                    tiamin: 0,
                    betaKaroten: 0,
                    retinol: 0
                },
                mineraler: {
                    jod: 0,
                    fosFor: 0,
                    kopper: 0,
                    selen: 0,
                    sink: 0,
                    magnesium: 0,
                    kalium: 0,
                    natrium: 0,
                    jern: 0,
                    kalsium: 0
                }
            };
            nutrients.forEach(nutrientGroup => {
                for(let [key, value] of Object.entries(summedNutrients.fett)) {
                    summedNutrients.fett[key] += nutrientGroup.fat[key];
                }
                for(let [key, value] of Object.entries(summedNutrients.mineraler)) {
                    summedNutrients.mineraler[key] += nutrientGroup.minerals[key];
                }
                for(let [key, value] of Object.entries(summedNutrients.karbohydrater)) {
                    summedNutrients.karbohydrater[key] += nutrientGroup.carbs[key];
                }
                for(let [key, value] of Object.entries(summedNutrients.vitaminer)) {
                    summedNutrients.vitaminer[key] += nutrientGroup.vitamins[key];
                }
            });
            return new DetailedNutrients({
                _id: new mongoose.Types.ObjectId(),
                fett: summedNutrients.fett,
                karbohydrater: summedNutrients.karbohydrater,
                vitaminer: summedNutrients.vitaminer,
                mineraler: summedNutrients.mineraler
            }).save();
        });
    }
};

function ObjectMap(object, mapFn) {
    return Object.keys(object).reduce(function (result, key) {
        result[key] = mapFn(object[key]);
        return result
    }, {})
}
