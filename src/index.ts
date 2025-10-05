//!native
//!optimize 2

import { GeneratedDifficultyEntry } from "./generated";

class Difficulty {
	static readonly DIFFICULTIES = new Map<string, Difficulty>();
	name: string | undefined;
	description: string | undefined;
	class: number | undefined;
	visualRating: string | undefined;
	layoutRating: number | undefined;
	color: Color3 | undefined;
	image: string | undefined;

	private static fromGeneratedEntry(entry: GeneratedDifficultyEntry) {
		return new Difficulty(entry.id)
			.setName(entry.name)
			.setDescription(entry.description)
			.setVisualRating(entry.visualRating)
			.setLayoutRating(entry.layoutRating)
			.setClass(entry.class)
			.setColor(Color3.fromRGB(entry.colorR, entry.colorG, entry.colorB));
	}

	static get(id: string) {
		return Difficulty.DIFFICULTIES.get(id);
	}

	constructor(public readonly id: string) {
		Difficulty.DIFFICULTIES.set(id, this);
	}

	setName(name: string) {
		this.name = name;
		return this;
	}

	setDescription(description: string) {
		this.description = description;
		return this;
	}

	setClass(difficultyClass: number) {
		this.class = difficultyClass;
		return this;
	}

	setVisualRating(visualRating: string) {
		this.visualRating = visualRating;
		return this;
	}

	setLayoutRating(layoutRating: number) {
		this.layoutRating = layoutRating;
		return this;
	}

	setColor(color: Color3) {
		this.color = color;
		return this;
	}

	setImage(image: string) {
		this.image = image;
		return this;
	}
}

export = Difficulty;
