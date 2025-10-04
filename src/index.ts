//!native
//!optimize 2

import { getAsset } from "./assetMap";

class Difficulty {

	static readonly DIFFICULTIES = new Map<string, Difficulty>();

	static readonly Bonuses = new Difficulty()
    .setName("Bonuses")
    .setColor(Color3.fromRGB(255, 252, 89))
    .setRating(-10000014)
    .setClass(-3);

	static readonly Excavation = new Difficulty()
    .setName("Materials")
    .setImage(getAsset("assets/Construct.png"))
    .setColor(Color3.fromRGB(110, 166, 255))
    .setRating(-10000013)
    .setClass(-3);

	static readonly Miscellaneous = new Difficulty()
    .setName("Miscellaneous")
    .setImage(getAsset("assets/Miscellaneous.png"))
    .setColor(Color3.fromRGB(255, 110, 110))
    .setRating(-10000012)
    .setClass(-3);

	static readonly TheFirstDifficulty = new Difficulty()
    .setName("The First Difficulty")
    .setImage(getAsset("assets/The First Difficulty.png"))
    .setColor(Color3.fromRGB(0, 0, 0))
    .setRating(-10000010)
    .setClass(-2);

	static readonly TheLowerGap = new Difficulty()
    .setName("The Lower Gap")
    .setImage(getAsset("assets/The Lower Gap.png"))
    .setColor(Color3.fromRGB(0, 79, 0))
    .setRating(-10000009)
    .setClass(-2);

	static readonly Negativity = new Difficulty()
    .setName("Negativity")
    .setImage(getAsset("assets/Negativity.png"))
    .setColor(Color3.fromRGB(146, 36, 143))
    .setRating(-10000008)
    .setClass(-2);

	static readonly Unimpossible = new Difficulty()
    .setName("Unimpossible")
    .setImage(getAsset("assets/Unimpossible.png"))
    .setColor(Color3.fromRGB(192, 0, 255))
    .setRating(-10000007)
    .setClass(-2);

	static readonly Friendliness = new Difficulty()
    .setName("Friendliness")
    .setImage(getAsset("assets/Friendliness.png"))
    .setColor(Color3.fromRGB(130, 253, 0))
    .setRating(-10000006)
    .setClass(-2);

	static readonly TrueEase = new Difficulty()
    .setName("True Ease")
    .setImage(getAsset("assets/True Ease.png"))
    .setColor(Color3.fromRGB(255, 255, 255))
    .setRating(-10000005)
    .setClass(-1);

	static readonly A = new Difficulty()
    .setName("A")
    .setImage(getAsset("assets/A.png"))
    .setColor(Color3.fromRGB(235, 26, 36))
    .setRating(-10000004)
    .setClass(-1);

	static readonly FelixTheA = new Difficulty()
    .setName("Felix the ДА")
    .setImage(getAsset("assets/Felix the ДА.png"))
    .setColor(Color3.fromRGB(77, 255, 0))
    .setRating(-10000003)
    .setClass(-1);

	static readonly Exist = new Difficulty()
    .setName("Exist")
    .setImage(getAsset("assets/Exist.png"))
    .setColor(Color3.fromRGB(255, 255, 255))
    .setRating(-10000002)
    .setClass(-1);

	static readonly ReversedPeripherality = new Difficulty()
    .setName("Reversed Peripherality")
    .setImage(getAsset("assets/Reversed Peripherality.png"))
    .setColor(Color3.fromRGB(127, 95, 140))
    .setRating(-10000001)
    .setClass(-1);

	static readonly Relax = new Difficulty()
    .setName("Relax")
    .setImage(getAsset("assets/Relax.png"))
    .setColor(Color3.fromRGB(255, 255, 255))
    .setRating(-1000000)
    .setClass(-1);

	static readonly Skip = new Difficulty()
    .setName("Skip")
    .setImage(getAsset("assets/Skip.png"))
    .setColor(Color3.fromRGB(255, 172, 101))
    .setRating(-1000)
    .setClass(-1);

	static readonly Restful = new Difficulty()
    .setName("Restful")
    .setImage(getAsset("assets/Restful.png"))
    .setColor(Color3.fromRGB(4, 61, 1))
    .setRating(-50)
    .setClass(-1);

	static readonly Ifinity = new Difficulty()
    .setName("Ifinity")
    .setImage(getAsset("assets/Ifinity.png"))
    .setColor(Color3.fromRGB(35, 7, 51))
    .setRating(-40)
    .setClass(-1);

	static readonly InstantWin = new Difficulty()
    .setName("Instant Win")
    .setImage(getAsset("assets/Instant Win.png"))
    .setColor(Color3.fromRGB(0, 46, 255))
    .setRating(-31)
    .setClass(-1);

	static readonly Millisecondless = new Difficulty()
    .setName("Millisecondless")
    .setImage(getAsset("assets/Millisecondless.png"))
    .setColor(Color3.fromRGB(244, 112, 254))
    .setRating(-30)
    .setClass(0);

	static readonly Astronomical = new Difficulty()
    .setName("Astronomical")
    .setImage(getAsset("assets/Astronomical.png"))
    .setColor(Color3.fromRGB(21, 0, 186))
    .setRating(-29.5)
    .setClass(0)

	static readonly Win = new Difficulty()
    .setName("Win")
    .setImage(getAsset("assets/Win.png"))
    .setColor(Color3.fromRGB(39, 119, 232))
    .setRating(-29)
    .setClass(0);

	static readonly Winsome = new Difficulty()
    .setName("Winsome")
    .setImage(getAsset("assets/Winsome.png"))
    .setColor(Color3.fromRGB(106, 205, 255))
    .setRating(-28)
    .setClass(0);

	static readonly DoNothing = new Difficulty()
    .setName("Do Nothing")
    .setImage(getAsset("assets/Do Nothing.png"))
    .setColor(Color3.fromRGB(153, 209, 229))
    .setRating(-27)
    .setClass(0);

	static readonly Sleepful = new Difficulty()
    .setName("Sleepful")
    .setImage(getAsset("assets/Sleepful.png"))
    .setColor(Color3.fromRGB(52, 155, 255))
    .setRating(-26.5)
    .setClass(0);

	static readonly Blessing = new Difficulty()
    .setName("Blessing")
    .setImage(getAsset("assets/Blessing.png"))
    .setColor(Color3.fromRGB(114, 224, 178))
    .setRating(-26)
    .setClass(0);

    static readonly Vintage = new Difficulty()
    .setName("Vintage")
    .setImage(getAsset("assets/Vintage.png"))
    .setColor(Color3.fromRGB(217, 120, 255))
    .setRating(-25)
    .setClass(0);

    static readonly Ifinitude = new Difficulty()
    .setName("Ifinitude")
    .setImage(getAsset("assets/Ifinitude.png"))
    .setColor(Color3.fromRGB(43, 43, 43))
    .setRating(-24.5)
    .setClass(0);

    static readonly JustAir = new Difficulty()
    .setName("Just Air")
    .setImage(getAsset("assets/Just Air.png"))
    .setColor(Color3.fromRGB(64, 115, 255))
    .setRating(-24)
    .setClass(0);

    static readonly Happylike = new Difficulty()
    .setName("Happylike")
    .setImage(getAsset("assets/Happylike.png"))
    .setColor(Color3.fromRGB(59, 59, 59))
    .setRating(-23)
    .setClass(0);

    static readonly Locomotion = new Difficulty()
    .setName("Locomotion")
    .setImage(getAsset("assets/Locomotion.png"))
    .setColor(Color3.fromRGB(255, 97, 97))
    .setRating(-22)
    .setClass(0);

    static readonly Walkthrough = new Difficulty()
    .setName("Walkthrough")
    .setImage(getAsset("assets/Walkthrough.png"))
    .setColor(Color3.fromRGB(107, 196, 255))
    .setRating(-21)
    .setClass(0);

    static readonly AutomaticJoyful = new Difficulty()
    .setName("Automatic Joyful")
    .setImage(getAsset("assets/Automatic Joyful.png"))
    .setColor(Color3.fromRGB(171, 255, 77))
    .setRating(-20)
    .setClass(0);

    static readonly Unlosable = new Difficulty()
    .setName("Unlosable")
    .setImage(getAsset("assets/Unlosable.png"))
    .setColor(Color3.fromRGB(255, 143, 255))
    .setRating(-19)
    .setClass(0);

    static readonly ShatteredBabass = new Difficulty()
    .setName("Shattered Babass")
    .setImage(getAsset("assets/Shattered Babass.png"))
    .setColor(Color3.fromRGB(147, 27, 220))
    .setRating(-18.5)
    .setClass(0);
    
    static readonly Frivolous = new Difficulty()
    .setName("Frivolous")
    .setImage(getAsset("assets/Frivolous.png"))
    .setColor(Color3.fromRGB(107, 196, 219))
    .setRating(-18)
    .setClass(0);

    static readonly Vibeness = new Difficulty()
    .setName("Vibeness")
    .setImage(getAsset("assets/Vibeness.png"))
    .setColor(Color3.fromRGB(255, 69, 156))
    .setRating(-17.5)
    .setClass(0);

    static readonly Automatic = new Difficulty()
    .setName("Automatic")
    .setImage(getAsset("assets/Automatic.png"))
    .setColor(Color3.fromRGB(214, 255, 186))
    .setRating(-17)
    .setClass(0);

    static readonly Spontaneous = new Difficulty()
    .setName("Spontaneous")
    .setImage(getAsset("assets/Spontaneous.png"))
    .setColor(Color3.fromRGB(117, 255, 28))
    .setRating(-16)
    .setClass(0);
    
    static readonly Joyful = new Difficulty()
    .setName("Joyful")
    .setColor(Color3.fromRGB(206, 250, 0))
    .setRating(-15)
    .setClass(1);

    static readonly DoSomething = new Difficulty()
    .setName("Do Something")
    .setImage(getAsset("assets/Do Something.png"))
    .setColor(Color3.fromRGB(0, 153, 255))
    .setRating(-14.5)
    .setClass(1);

    static readonly Placid = new Difficulty()
    .setName("Placid")
    .setImage(getAsset("assets/Placid.png"))
    .setColor(Color3.fromRGB(255, 255, 255))
    .setRating(-14)
    .setClass(1);

    static readonly PressAKey = new Difficulty()
    .setName("Press A Key")
    .setImage(getAsset("assets/Press a Key.png"))
    .setColor(Color3.fromRGB(255, 255, 255))
    .setRating(-13)    
    .setClass(1);

    static readonly TapToMove = new Difficulty()
    .setName("Tap to Move")
    .setImage(getAsset("assets/Tap to Move.png"))
    .setColor(Color3.fromRGB(41, 41, 41))
    .setRating(-12.66)    
    .setClass(1);

    static readonly WalkASlope = new Difficulty()
    .setName("Walk A Slope")
    .setImage(getAsset("assets/Walk A Slope.png"))
    .setColor(Color3.fromRGB(112, 112, 112))
    .setRating(-12.33)    
    .setClass(1);

    static readonly ClimbATruss = new Difficulty()
    .setName("Climb A Truss")
    .setImage(getAsset("assets/Climb A Truss.png"))
    .setColor(Color3.fromRGB(134, 133, 133))
    .setRating(-12)    
    .setClass(1);

    static readonly Tranquil = new Difficulty()
    .setName("Tranquil")
    .setImage(getAsset("assets/Tranquil.png"))
    .setColor(Color3.fromRGB(0, 141, 255))
    .setRating(-11.5)
    .setClass(1);

    static readonly Jumpless = new Difficulty()
    .setName("Jumpless")
    .setColor(Color3.fromRGB(201, 192, 231))
    .setRating(-11)
    .setClass(1);

    static readonly Starter = new Difficulty()
    .setName("Starter")
    .setImage(getAsset("assets/Starter.png"))
    .setColor(Color3.fromRGB(0, 168, 243))
    .setRating(-10)
    .setClass(1);

    static readonly Cakewalk = new Difficulty()
    .setName("Cakewalk")
    .setImage(getAsset("assets/Cakewalk.png"))
    .setColor(Color3.fromRGB(66, 165, 245))
    .setRating(-9.5)
    .setClass(1);

    static readonly Sweet = new Difficulty()
    .setName("Sweet")
    .setImage(getAsset("assets/Sweet.png"))
    .setColor(Color3.fromRGB(255, 253, 150))
    .setRating(-9)
    .setClass(1);

    static readonly Sugary = new Difficulty()
    .setName("Sugary")
    .setImage(getAsset("assets/Sugary.png"))
    .setColor(Color3.fromRGB(255, 255, 0))
    .setRating(-8.66)
    .setClass(1);

    static readonly Aesthetic = new Difficulty()
    .setName("Aesthetic")
    .setImage(getAsset("assets/Aesthetic.png"))
    .setColor(Color3.fromRGB(118, 244, 71))
    .setRating(-8.33)
    .setClass(1);

    static readonly Lovely = new Difficulty()
    .setName("Lovely")
    .setImage(getAsset("assets/Lovely.png"))
    .setColor(Color3.fromRGB(221, 251, 221))
    .setRating(-8)
    .setClass(1);
    
    static readonly Glee = new Difficulty()
    .setName("Glee")
    .setImage(getAsset("assets/Glee.png"))
    .setColor(Color3.fromRGB(248, 218, 219))
    .setRating(-7.5)
    .setClass(1);

    static readonly Flowerness = new Difficulty()
    .setName("Flowerness")
    .setImage(getAsset("assets/Flowerness.png"))
    .setColor(Color3.fromRGB(157, 149, 254))
    .setRating(-7)
    .setClass(1);

    static readonly Coasterifying = new Difficulty()
    .setName("Coasterifying")
    .setImage(getAsset("assets/Coasterifying.png"))
    .setColor(Color3.fromRGB(0, 115, 255))
    .setRating(-6.66)
    .setClass(1);

    static readonly ADifficultyNamedDifficulty = new Difficulty()
    .setName("A Difficulty Named Difficulty")
    .setImage(getAsset("assets/A Difficulty Named Difficulty.png"))
    .setColor(Color3.fromRGB(247, 51, 83))
    .setRating(-6.33)
    .setClass(1);

    static readonly Pleasant = new Difficulty()
    .setName("Pleasant")
    .setImage(getAsset("assets/Pleasant.png"))
    .setColor(Color3.fromRGB(161, 220, 255))
    .setRating(-6)
    .setClass(1);

    static readonly PieceOCake = new Difficulty()
    .setName("Piece o' Cake")
    .setImage(getAsset("assets/Piece o&#39; Cake.png"))
    .setColor(Color3.fromRGB(254, 149, 253))
    .setRating(-5.5)
    .setClass(1);

    static readonly Tutorial = new Difficulty()
    .setName("Tutorial")
    .setImage(getAsset("assets/Tutorial.png"))
    .setColor(Color3.fromRGB(24, 83, 17))
    .setRating(-5)
    .setClass(1);

    static readonly HellishEncore = new Difficulty()
    .setName("Hellish Encore")
    .setImage(getAsset("assets/Hellish Encore.png"))
    .setColor(Color3.fromRGB(170, 5, 8))
    .setRating(-4.66)
    .setClass(1);

    static readonly Delightful = new Difficulty()
    .setName("Delightful")
    .setImage(getAsset("assets/Delightful.png"))
    .setColor(Color3.fromRGB(236, 218, 140))
    .setRating(-4.33)
    .setClass(1);
    
    static readonly TooEasy = new Difficulty()
    .setName("TooEasy")
    .setImage(getAsset("assets/TooEasy.png"))
    .setColor(Color3.fromRGB(14, 88, 1))
    .setRating(-4)
    .setClass(1);

    static readonly Peaceful = new Difficulty()
    .setName("Peaceful")
    .setImage(getAsset("assets/Peaceful.png"))
    .setColor(Color3.fromRGB(199, 176, 218))
    .setRating(-3)
    .setClass(1);

    static readonly Playful = new Difficulty()
    .setName("Playful")
    .setImage(getAsset("assets/Playful.png"))
    .setColor(Color3.fromRGB(163, 255, 80))
    .setRating(-2.5)
    .setClass(1);

    static readonly Magnificent = new Difficulty()
    .setName("Magnificent")
    .setImage(getAsset("assets/Magnificent.png"))
    .setColor(Color3.fromRGB(145, 206, 255))
    .setRating(-2)
    .setClass(1);

    static readonly Facile = new Difficulty()
    .setName("Facile")
    .setImage(getAsset("assets/Facile.png"))
    .setColor(Color3.fromRGB(87, 215, 254))
    .setRating(-1.5)
    .setClass(1);

    static readonly Effortlessless = new Difficulty()
    .setName("Effortlessless")
    .setColor(Color3.fromRGB(153, 217, 234))
    .setRating(-1)
    .setClass(1);

    static readonly Gravel = new Difficulty()
    .setName("Gravel")
    .setColor(Color3.fromRGB(154, 246, 209))
    .setRating(-0.5)
    .setClass(1);

    static readonly Effortless = new Difficulty()
    .setName("Effortless")
    .setColor(Color3.fromRGB(0, 206, 0))
    .setRating(0)
    .setClass(2);

    static readonly Playground = new Difficulty()
    .setName("Playground")
    .setColor(Color3.fromRGB(0, 206, 100))
    .setRating(0.33)
    .setClass(2);

    static readonly Simple = new Difficulty()
    .setName("Simple")
    .setImage(getAsset("assets/Simple.png"))
    .setColor(Color3.fromRGB(76, 176, 81))
    .setRating(0.66)
    .setClass(2);

    static readonly Easy = new Difficulty()
    .setName("Easy")
    .setColor(Color3.fromRGB(118, 244, 71))
    .setRating(1)
    .setClass(2);

	id!: string;
	name: string | undefined;
    description: string | undefined;
	class: number | undefined;
	rating: number | undefined;
	color: Color3 | undefined;
	image: string | undefined;

	constructor() {

	}

	setName(name: string) {
		this.name = name;
		return this;
	}

	setClass(difficultyClass: number) {
		this.class = difficultyClass;
		return this;
	}

	setRating(rating: number) {
		this.rating = rating;
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

    static {
        for (const [i, v] of pairs(this)) {
            if (typeOf(v) === "table" && ((v as unknown) as {__index: unknown}).__index === this && (i as string) !== "__index") {
                (v as Difficulty).id = i;
                this.DIFFICULTIES.set(i, v as Difficulty);
            }
        }
    }

    static get(id: string) {
		return Difficulty.DIFFICULTIES.get(id);
	}

    static set(id: string, difficulty: Difficulty) {
        difficulty.id = id;
        Difficulty.DIFFICULTIES.set(id, difficulty);
    }
}

export = Difficulty;