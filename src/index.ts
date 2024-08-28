//!native
//!optimize 2

class Difficulty {

	static readonly DIFFICULTIES = new Map<string, Difficulty>();

	static readonly Bonuses = new Difficulty()
    .setName("Bonuses")
    .setImage(0)
    .setColor(Color3.fromRGB(255, 252, 89))
    .setRating(-10000014)
    .setClass(-3);

	static readonly Excavation = new Difficulty()
    .setName("Materials")
    .setImage(0)
    .setColor(Color3.fromRGB(110, 166, 255))
    .setRating(-10000013)
    .setClass(-3);

	static readonly Miscellaneous = new Difficulty()
    .setName("Miscellaneous")
    .setImage(17790114135)
    .setColor(Color3.fromRGB(255, 110, 110))
    .setRating(-10000012)
    .setClass(-3);

	static readonly Main = new Difficulty()
    .setName("Items")
    .setImage(0)
    .setColor(Color3.fromRGB(255, 245, 110))
    .setRating(-10000011)
    .setClass(-3);

	static readonly TheFirstDifficulty = new Difficulty()
    .setName("The First Difficulty")
    .setImage(13521197654)
    .setColor(Color3.fromRGB(0, 0, 0))
    .setRating(-10000010)
    .setClass(-2);

	static readonly TheLowerGap = new Difficulty()
    .setName("The Lower Gap")
    .setImage(16500432025)
    .setColor(Color3.fromRGB(0, 79, 0))
    .setRating(-10000009)
    .setClass(-2);

	static readonly Negativity = new Difficulty()
    .setName("Negativity")
    .setImage(11996464962)
    .setColor(Color3.fromRGB(146, 36, 143))
    .setRating(-10000008)
    .setClass(-2);

	static readonly Unimpossible = new Difficulty()
    .setName("Unimpossible")
    .setImage(16623639157)
    .setColor(Color3.fromRGB(192, 0, 255))
    .setRating(-10000007)
    .setClass(-2);

	static readonly Friendliness = new Difficulty()
    .setName("Friendliness")
    .setImage(15380381686)
    .setColor(Color3.fromRGB(130, 253, 0))
    .setRating(-10000006)
    .setClass(-2);

	static readonly TrueEase = new Difficulty()
    .setName("True Ease")
    .setImage(7851469193)
    .setColor(Color3.fromRGB(255, 255, 255))
    .setRating(-10000005)
    .setClass(-1);

	static readonly A = new Difficulty()
    .setName("A")
    .setImage(7690507721)
    .setColor(Color3.fromRGB(235, 26, 36))
    .setRating(-10000004)
    .setClass(-1);

	static readonly FelixTheA = new Difficulty()
    .setName("Felix the ДА")
    .setImage(16420667835)
    .setColor(Color3.fromRGB(77, 255, 0))
    .setRating(-10000003)
    .setClass(-1);

	static readonly Exist = new Difficulty()
    .setName("Exist")
    .setImage(16420694167)
    .setColor(Color3.fromRGB(255, 255, 255))
    .setRating(-10000002)
    .setClass(-1);

	static readonly ReversedPeripherality = new Difficulty()
    .setName("Reversed Peripherality")
    .setImage(16006133166)
    .setColor(Color3.fromRGB(127, 95, 140))
    .setRating(-10000001)
    .setClass(-1);

	static readonly Relax = new Difficulty()
    .setName("Relax")
    .setImage(13054817910)
    .setColor(Color3.fromRGB(255, 255, 255))
    .setRating(-1000000)
    .setClass(-1);

	static readonly Skip = new Difficulty()
    .setName("Skip")
    .setImage(7662792899)
    .setColor(Color3.fromRGB(255, 172, 101))
    .setRating(-1000)
    .setClass(-1);

	static readonly Restful = new Difficulty()
    .setName("Restful")
    .setImage(15097557171)
    .setColor(Color3.fromRGB(4, 61, 1))
    .setRating(-50)
    .setClass(-1);

	static readonly Ifinity = new Difficulty()
    .setName("Ifinity")
    .setImage(11622168387)
    .setColor(Color3.fromRGB(35, 7, 51))
    .setRating(-40)
    .setClass(-1);

	static readonly InstantWin = new Difficulty()
    .setName("Instant Win")
    .setImage(16421451231)
    .setColor(Color3.fromRGB(0, 46, 255))
    .setRating(-31)
    .setClass(-1);

	static readonly Millisecondless = new Difficulty()
    .setName("Millisecondless")
    .setImage(16421468207)
    .setColor(Color3.fromRGB(244, 112, 254))
    .setRating(-30)
    .setClass(0);

	static readonly Astronomical = new Difficulty()
    .setName("Astronomical")
    .setImage(17441599695)
    .setColor(Color3.fromRGB(21, 0, 186))
    .setRating(-29.5)
    .setClass(0)

	static readonly Win = new Difficulty()
    .setName("Win")
    .setImage(6382362791)
    .setColor(Color3.fromRGB(39, 119, 232))
    .setRating(-29)
    .setClass(0);

	static readonly Winsome = new Difficulty()
    .setName("Winsome")
    .setImage(14081287986)
    .setColor(Color3.fromRGB(106, 205, 255))
    .setRating(-28)
    .setClass(0);

	static readonly DoNothing = new Difficulty()
    .setName("Do Nothing")
    .setImage(7662806862)
    .setColor(Color3.fromRGB(153, 209, 229))
    .setRating(-27)
    .setClass(0);

	static readonly Sleepful = new Difficulty()
    .setName("Sleepful")
    .setImage(17705157889)
    .setColor(Color3.fromRGB(52, 155, 255))
    .setRating(-26.5)
    .setClass(0);

	static readonly Blessing = new Difficulty()
    .setName("Blessing")
    .setImage(17705253718)
    .setColor(Color3.fromRGB(114, 224, 178))
    .setRating(-26)
    .setClass(0);

    static readonly Vintage = new Difficulty()
    .setName("Vintage")
    .setImage(16556628545)
    .setColor(Color3.fromRGB(217, 120, 255))
    .setRating(-25)
    .setClass(0);

    static readonly Ifinitude = new Difficulty()
    .setName("Ifinitude")
    .setImage(16257720532)
    .setColor(Color3.fromRGB(43, 43, 43))
    .setRating(-24.5)
    .setClass(0);

    static readonly JustAir = new Difficulty()
    .setName("Just Air")
    .setImage(12783815605)
    .setColor(Color3.fromRGB(64, 115, 255))
    .setRating(-24)
    .setClass(0);

    static readonly Happylike = new Difficulty()
    .setName("Happylike")
    .setImage(13964564391)
    .setColor(Color3.fromRGB(59, 59, 59))
    .setRating(-23)
    .setClass(0);

    static readonly Locomotion = new Difficulty()
    .setName("Locomotion")
    .setImage(14037195364)
    .setColor(Color3.fromRGB(255, 97, 97))
    .setRating(-22)
    .setClass(0);

    static readonly Walkthrough = new Difficulty()
    .setName("Walkthrough")
    .setImage(13966882356)
    .setColor(Color3.fromRGB(107, 196, 255))
    .setRating(-21)
    .setClass(0);

    static readonly AutomaticJoyful = new Difficulty()
    .setName("Automatic Joyful")
    .setImage(16007879496)
    .setColor(Color3.fromRGB(171, 255, 77))
    .setRating(-20)
    .setClass(0);

    static readonly Unlosable = new Difficulty()
    .setName("Unlosable")
    .setImage(7708394269)
    .setColor(Color3.fromRGB(255, 143, 255))
    .setRating(-19)
    .setClass(0);

    static readonly Frivolous = new Difficulty()
    .setName("Frivolous")
    .setImage(17487417743)
    .setColor(Color3.fromRGB(107, 196, 219))
    .setRating(-18)
    .setClass(0);

    static readonly Automatic = new Difficulty()
    .setName("Automatic")
    .setImage(6382419171)
    .setColor(Color3.fromRGB(214, 255, 186))
    .setRating(-17)
    .setClass(0);

    static readonly Spontaneous = new Difficulty()
    .setName("Spontaneous")
    .setImage(12646657197)
    .setColor(Color3.fromRGB(117, 255, 28))
    .setRating(-16)
    .setClass(0);
    
    static readonly Joyful = new Difficulty()
    .setName("Joyful")
    .setImage(9034496541)
    .setColor(Color3.fromRGB(206, 250, 0))
    .setRating(-15)
    .setClass(1);

    /**
     * @deprecated use {@link Ifinitude} instead
     */
    static readonly Infinitude = this.Ifinitude;

	id!: string;
	name: string | undefined = undefined;
	class: number | undefined = undefined;
	rating: number | undefined = undefined;
	color: Color3 | undefined = undefined;
	image: number | undefined = undefined;

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

	setImage(image: number) {
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
}

export = Difficulty;