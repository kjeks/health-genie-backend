const mongoose = require('mongoose');

let DetailedNutrientsSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
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
            fett: {
                flerumettet: nutrients.get('Flerumettet'),
                enumettet: nutrients.get('Enerumettet'),
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
                A: nutrients.get('Vitanmin A'),
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
                fosfor: nutrients.get('Forfor'),
                kopper: nutrients.get('Kopper'),
                selen: nutrients.get('Selen'),
                sink: nutrients.get('Sink'),
                magnesium: nutrients.get('Magnesium'),
                kalium: nutrients.get('Kalium'),
                natrium: nutrients.get('Natrium'),
                jern: nutrients.get('Iron'),
                kalsium: nutrients.get('Kalsium')
            }
        }).save();
    }
};
