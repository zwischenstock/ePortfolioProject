// The values should match the keys, as Species[str] is used to check for validity.
const Species = {
	Oviparous: 'Oviparous',
	Mammal: 'Mammal'
}

class Animal {
	constructor(tracking, name, species, animal, eggs, nursing) {
		if (typeof nursing == 'string')
			nursing = nursing == 'true'

		this.tracking = tracking
		this.name = name
		this.species = species
		this.animal = animal
		this.eggs = (Animal.canLayEggs(species) ? eggs : 0)
		this.nursing = (Animal.canNurse(species) ? nursing : false)
	}

	toObject() {
		return {
			tracking: this.tracking,
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