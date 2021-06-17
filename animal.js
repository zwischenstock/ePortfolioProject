// The values should match the keys, as Species[str] is used to check for validity.
const Species = {
	Oviparous: 'Oviparous',
	Mammal: 'Mammal'
}

// TODO: Validity checking on parameters
class Animal {
	constructor(name, species, animal, eggs, nursing) {
		this.name = name
		this.species = species
		this.animal = animal
		this.eggs = (Animal.canLayEggs(species) ? eggs : 0)
		this.nursing = (Animal.canNurse(species) ? nursing : false)
	}

	// TODO: Check if this is necessary. Potentially used when sending to a view.
	toObject() {
		return {
			name: this.name,
			species: this.species,
			animal: this.animal,
			eggs: this.eggs,
			nursing: this.nursing
		}
	}

	static fromObject(obj) {
		return Animal(obj.name, obj.species, obj.animal, obj.eggs, obj.nursing)
	}

	static isValidSpecies(species) {
		return (typeof species == 'string' && Species[species]) ? true : false
	}

	static canNurse(species) {
		return Species[species] == Species.Mammal
	}

	static canLayEggs(species) {
		return Species[species] == Species.Oviparous
	}
}

exports.Species = Species
exports.Animal = Animal