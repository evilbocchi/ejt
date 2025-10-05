local fs = require("@lune/fs")
local luau = require("@lune/luau")
local process = require("@lune/process")
local roblox = require("@lune/roblox")

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


addTest("Test Difficulty Creation", function()
    local easy = Difficulty.new("Easy")
    assertEqual(easy.id, "Easy")

    local hard = Difficulty.new("Hard")
    assertEqual(hard.id, "Hard")
end)

runTests()