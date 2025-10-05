local fs = require("@lune/fs")
local luau = require("@lune/luau")

local bytecode = luau.compile(fs.readFile("out/init.luau"))
local Difficulty = luau.load(bytecode)()

print(Difficulty)