local fs = require("@lune/fs")
local luau = require("@lune/luau")
local process = require("@lune/process")
local roblox = require("@lune/roblox")
local Color3 = roblox.Color3

local bytecode = luau.compile(fs.readFile("out/init.luau"))
local Difficulty = luau.load(bytecode, { environment = roblox })()

local tests = {}

function addTest(name, fn)
	table.insert(tests, { name = name, fn = fn })
end

function assertEqual(actual, expected, msg)
	if actual ~= expected then
		error(msg or ("Expected " .. tostring(expected) .. ", got " .. tostring(actual)), 2)
	end
end

function assertTrue(condition, msg)
	if not condition then
		error(msg or "Expected condition to be truthy", 2)
	end
end

function runTests()
	local passed, failed = 0, 0
	for _, test in ipairs(tests) do
		local ok, err = pcall(test.fn)
		if ok then
			print("[PASS]", test.name)
			passed += 1
		else
			print("[FAIL]", test.name, err)
			failed += 1
		end
	end
	print("Tests finished. Passed:", passed, "Failed:", failed)
    if failed > 0 then
        process.exit(1)
    else
        process.exit(0)
    end
end


addTest("Difficulty.new registers instance in global registry", function()
	local id = "__copilot_unique_difficulty__"
	assertTrue(Difficulty.DIFFICULTIES[id] == nil, "Expected registry to be clean before test")

	local created = Difficulty.new(id)
	assertEqual(created.id, id)
	assertEqual(Difficulty.DIFFICULTIES[id], created, "Expected constructor to register instance")

	Difficulty.DIFFICULTIES[id] = nil
end)

addTest("Setter methods mutate fields and support chaining", function()
	local id = "__copilot_chaining__"
	assertTrue(Difficulty.DIFFICULTIES[id] == nil)

	local instance = Difficulty.new(id)
	local nameTarget = "Chain Target"
	local descriptionTarget = "A description used for chaining tests."
	local classTarget = 42
	local visualTarget = "STRESS"
	local layoutTarget = 3.5
	local colorTarget = Color3.fromRGB(1, 2, 3)
	local imageTarget = "rbxassetid://1234567890"

	assertEqual(instance:setName(nameTarget), instance, "setName should return the instance")
	assertEqual(instance:setDescription(descriptionTarget), instance, "setDescription should return the instance")
	assertEqual(instance:setClass(classTarget), instance, "setClass should return the instance")
	assertEqual(instance:setVisualRating(visualTarget), instance, "setVisualRating should return the instance")
	assertEqual(instance:setLayoutRating(layoutTarget), instance, "setLayoutRating should return the instance")
	assertEqual(instance:setColor(colorTarget), instance, "setColor should return the instance")
	assertEqual(instance:setImage(imageTarget), instance, "setImage should return the instance")

	assertEqual(instance.name, nameTarget)
	assertEqual(instance.description, descriptionTarget)
	assertEqual(instance.class, classTarget)
	assertEqual(instance.visualRating, visualTarget)
	assertEqual(instance.layoutRating, layoutTarget)
	assertEqual(instance.color, colorTarget)
	assertEqual(instance.image, imageTarget)
	assertEqual(Difficulty.DIFFICULTIES[id], instance)

	Difficulty.DIFFICULTIES[id] = nil
end)

addTest("Static get returns generated difficulties", function()
	local automatic = Difficulty.Automatic
	assertTrue(automatic ~= nil, "Expected Automatic difficulty to exist")
	assertEqual(automatic.id, "Automatic")
	assertEqual(Difficulty:get("Automatic"), automatic)
	assertEqual(Difficulty.DIFFICULTIES["Automatic"], automatic)
	assertEqual(automatic.name, "Automatic")
	assertEqual(automatic.class, 0)
	assertEqual(automatic.visualRating, "-17")
	assertTrue(type(automatic.description) == "string" and string.find(automatic.description, "sit back", 1, true) ~= nil, "Expected description to mention automation details")
	assertTrue(automatic.color ~= nil, "Expected Automatic to have a color")

	local cakewalk = Difficulty.Cakewalk
	assertTrue(cakewalk ~= nil, "Expected Cakewalk difficulty to exist")
	assertEqual(Difficulty:get("Cakewalk"), cakewalk)
	assertEqual(cakewalk.name, "Cakewalk")
	assertEqual(cakewalk.class, 1)
	assertEqual(cakewalk.visualRating, "-9.5")
end)

runTests()