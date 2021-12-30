function groundLevelAtColumn (col: number) {
    return world_ground_height[col]
}
controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
    if (tool_active == "hammer" && controller.A.isPressed()) {
        if (tiles.locationXY(tiles.locationOfSprite(char), tiles.XY.row) - grid.spriteRow(selected_block) < 3) {
            grid.move(selected_block, 0, -1)
        }
    }
})
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    if (tool_active == "hammer") {
        tool_active = "pickaxe"
        char.say("pickaxe", 200)
    } else {
        tool_active = "hammer"
        char.say("hammer", 200)
    }
})
function generateGroundHeight () {
    world_ground_height = []
    ground_prev = 15
    ground_min = 8
    ground_max = 25
    for (let col = 0; col <= world_cols - 1; col++) {
        if (Math.percentChance(15)) {
            ground_current = Math.constrain(ground_prev - 1, ground_min, ground_max)
        } else if (Math.percentChance(15)) {
            ground_current = Math.constrain(ground_prev + 1, ground_min, ground_max)
        } else if (Math.percentChance(5)) {
            ground_current = Math.constrain(ground_prev - randint(2, 5), ground_min, ground_max)
        } else if (Math.percentChance(5)) {
            ground_current = Math.constrain(ground_prev + randint(2, 5), ground_min, ground_max)
        } else {
            ground_current = ground_prev
        }
        ground_prev = ground_current
        world_ground_height.push(ground_current)
    }
}
function buildValid () {
    if (char.overlapsWith(selected_block)) {
        return 0
    } else if (tiles.tileIsWall(tiles.locationOfSprite(selected_block))) {
        return 0
    } else {
        return 1
    }
}
// Game Systems
// 
// -----------
// 
// crafting
// 
// inventory
// 
// monsters
// 
// day/night cycle
// 
// equipment
// 
// - pickaxe
// 
// - axe
// 
// - hammer
// 
// - sword
// 
// multiplayer
// 
// bosses?
// 
// build
// 
// mining/getting resources
// 
// fun
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (tool_active == "pickaxe") {
        if (!(char_button_direction < 0)) {
            if (tiles.tileIsWall(tiles.locationInDirection(tiles.locationOfSprite(char), char_button_direction))) {
                if (!(tiles.tileIs(tiles.locationInDirection(tiles.locationOfSprite(char), char_button_direction), assets.tile`CORE`))) {
                    if (isActionLocationAboveGround(char, char_button_direction)) {
                        tiles.setTileAt(tiles.locationInDirection(tiles.locationOfSprite(char), char_button_direction), assets.tile`Stone_Background`)
                        tiles.setWallAt(tiles.locationInDirection(tiles.locationOfSprite(char), char_button_direction), false)
                    } else {
                        tiles.setTileAt(tiles.locationInDirection(tiles.locationOfSprite(char), char_button_direction), assets.tile`Sky_Block`)
                        tiles.setWallAt(tiles.locationInDirection(tiles.locationOfSprite(char), char_button_direction), false)
                    }
                }
            }
        }
    } else if (tool_active == "hammer") {
        selected_block = sprites.create(buildable_blocks._pickRandom(), SpriteKind.Food)
        sprites.setDataImage(selected_block, "img", selected_block.image)
sprites.setDataNumber(selected_block, "blink", 0)
        sprites.setDataNumber(selected_block, "blink_at", 15)
        sprites.setDataNumber(selected_block, "blink_max", 30)
        selected_block.z = -1
        grid.place(selected_block, tiles.locationInDirection(tiles.locationInDirection(tiles.locationOfSprite(char), CollisionDirection.Bottom), CollisionDirection.Bottom))
    } else {
    	
    }
})
function setupVariables () {
    tick_speed = 1000
    char_speed_max = 125
    char_speed_rate = 10
    char_speed_decel_rate = 0.85
    char_speed_jump = -150
    tool_active = "hammer"
}
controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    if (tool_active == "hammer" && controller.A.isPressed()) {
        if (tiles.locationXY(tiles.locationOfSprite(char), tiles.XY.column) - grid.spriteCol(selected_block) < 4) {
            grid.move(selected_block, -1, 0)
        }
    }
})
function generateWorld () {
    world_rows = tiles.tilemapRows() - 0
    world_cols = tiles.tilemapColumns() - 0
    generateGroundHeight()
    for (let col2 = 0; col2 <= world_cols - 1; col2++) {
        for (let row = 0; row <= world_rows - 1; row++) {
            if (row == world_rows - 1) {
                tiles.setTileAt(tiles.getTileLocation(col2, row), assets.tile`CORE`)
                tiles.setWallAt(tiles.getTileLocation(col2, row), true)
            } else if (row > world_ground_height[col2]) {
                if (Math.percentChance(75)) {
                    tiles.setTileAt(tiles.getTileLocation(col2, row), assets.tile`stone`)
                    tiles.setWallAt(tiles.getTileLocation(col2, row), true)
                } else {
                    tiles.setTileAt(tiles.getTileLocation(col2, row), assets.tile`Dirt`)
                    tiles.setWallAt(tiles.getTileLocation(col2, row), true)
                }
            } else if (Math.percentChance(100)) {
                if (row == world_ground_height[col2]) {
                    tiles.setTileAt(tiles.getTileLocation(col2, row), assets.tile`Grass`)
                    tiles.setWallAt(tiles.getTileLocation(col2, row), true)
                }
            } else {
            	
            }
        }
    }
    generatePlants()
}
function isActionLocationAboveGround (char: Sprite, button_direction: number) {
    return tiles.locationXY(tiles.locationInDirection(tiles.locationOfSprite(char), button_direction), tiles.XY.row) >= groundLevelAtColumn(tiles.locationXY(tiles.locationInDirection(tiles.locationOfSprite(char), button_direction), tiles.XY.column))
}
function generatePlants () {
    for (let col3 = 0; col3 <= world_cols - 1; col3++) {
        ground_current = world_ground_height[col3]
        if (Math.percentChance(10)) {
            tiles.setTileAt(tiles.getTileLocation(col3, ground_current - 1), assets.tile`BushEmpty`)
        } else if (Math.percentChance(25)) {
            tree_height = randint(2, 5)
            tiles.setTileAt(tiles.getTileLocation(col3, ground_current - 1), assets.tile`TreeTrunk0`)
            for (let index = 0; index <= tree_height - 2; index++) {
                tiles.setTileAt(tiles.getTileLocation(col3, ground_current - (index + 2)), assets.tile`TreeLog0`)
            }
            tiles.setTileAt(tiles.getTileLocation(col3, ground_current - tree_height), assets.tile`TreeTop`)
        }
    }
}
controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    if (tool_active == "hammer" && controller.A.isPressed()) {
        if (grid.spriteCol(selected_block) - tiles.locationXY(tiles.locationOfSprite(char), tiles.XY.column) < 4) {
            grid.move(selected_block, 1, 0)
        }
    }
})
controller.A.onEvent(ControllerButtonEvent.Released, function () {
    if (tool_active == "hammer") {
        if (buildValid() == 1) {
            tiles.setTileAt(tiles.locationOfSprite(selected_block), sprites.readDataImage(selected_block, "img"))
            tiles.setWallAt(tiles.locationOfSprite(selected_block), true)
            selected_block.destroy()
        } else {
            selected_block.destroy(effects.disintegrate, 100)
        }
    } else {
    	
    }
})
function setupBuildables () {
    buildable_blocks = []
    buildable_blocks.push(assets.tile`brick_block`)
    buildable_blocks.push(assets.tile`Rock_Block`)
    buildable_blocks.push(assets.tile`Dirt`)
    buildable_blocks.push(assets.tile`stone`)
    buildable_blocks.push(assets.tile`BushEmpty`)
}
controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
    if (tool_active == "hammer" && controller.A.isPressed()) {
        if (grid.spriteRow(selected_block) - tiles.locationXY(tiles.locationOfSprite(char), tiles.XY.row) < 3) {
            grid.move(selected_block, 0, 1)
        }
    }
})
let tree_height = 0
let world_rows = 0
let char_speed_jump = 0
let char_speed_decel_rate = 0
let char_speed_rate = 0
let char_speed_max = 0
let tick_speed = 0
let buildable_blocks: Image[] = []
let ground_current = 0
let world_cols = 0
let ground_max = 0
let ground_min = 0
let ground_prev = 0
let tool_active = ""
let world_ground_height: number[] = []
let char_button_direction = 0
let char: Sprite = null
let selected_block: Sprite = null
setupVariables()
tiles.setTilemap(tilemap`World`)
char = sprites.create(assets.image`PlayerIdle0`, SpriteKind.Player)
char.ay = 250
char_button_direction = -1
generateWorld()
setupBuildables()
scene.cameraFollowSprite(char)
tiles.placeOnTile(char, tiles.getTileLocation(50, 7))
game.onUpdate(function () {
    if (controller.down.isPressed()) {
        char_button_direction = 3
    } else if (controller.up.isPressed()) {
        char_button_direction = 1
    } else if (controller.right.isPressed()) {
        char_button_direction = 2
    } else if (controller.left.isPressed()) {
        char_button_direction = 0
    } else {
        char_button_direction = -1
    }
})
game.onUpdate(function () {
    if (tool_active == "hammer" && controller.A.isPressed()) {
        char.vx = 0
        if (sprites.readDataNumber(selected_block, "blink") >= sprites.readDataNumber(selected_block, "blink_at")) {
            selected_block.setImage(img`
                5 5 f f f f f 5 5 f f f f f 5 5 
                5 . . . . . . . . . . . . . . 5 
                f . . . . . . . . . . . . . . f 
                f . . . . . . . . . . . . . . f 
                f . . . . . . . . . . . . . . f 
                f . . . . . . . . . . . . . . f 
                f . . . . . . 5 5 . . . . . . f 
                5 . . . . . 5 f f 5 . . . . . 5 
                5 . . . . . 5 f f 5 . . . . . 5 
                f . . . . . . 5 5 . . . . . . f 
                f . . . . . . . . . . . . . . f 
                f . . . . . . . . . . . . . . f 
                f . . . . . . . . . . . . . . f 
                f . . . . . . . . . . . . . . f 
                5 . . . . . . . . . . . . . . 5 
                5 5 f f f f f 5 5 f f f f f 5 5 
                `)
        } else {
            selected_block.setImage(sprites.readDataImage(selected_block, "img"))
        }
        sprites.changeDataNumberBy(selected_block, "blink", 1)
        if (sprites.readDataNumber(selected_block, "blink") >= sprites.readDataNumber(selected_block, "blink_max")) {
            sprites.setDataNumber(selected_block, "blink", 0)
        }
    } else {
        if (char.isHittingTile(CollisionDirection.Bottom)) {
            if (controller.up.isPressed()) {
                char.vy = char_speed_jump
            }
        }
        if (controller.left.isPressed()) {
            if (!(char.isHittingTile(CollisionDirection.Left))) {
                char.vx = Math.constrain(char.vx - char_speed_rate, 0 - char_speed_max, char_speed_max)
            }
        } else if (controller.right.isPressed()) {
            if (!(char.isHittingTile(CollisionDirection.Right))) {
                char.vx = Math.constrain(char.vx + char_speed_rate, 0 - char_speed_max, char_speed_max)
            }
        } else {
            if (Math.abs(char.vx) > 1) {
                char.vx = char.vx * char_speed_decel_rate
            } else {
                char.vx = 0
            }
        }
    }
})
forever(function () {
    if (Math.percentChance(75)) {
        music.playMelody("C B A G A G F G ", 150)
        music.playMelody("G F G A B A D G ", 150)
        for (let index = 0; index < 2; index++) {
            music.playMelody("E D G F B A C5 B ", 150)
            music.playMelody("B C5 G A E F D E ", 150)
        }
        music.playMelody("C D E F G A B C ", 150)
        music.playMelody("C5 B A G F E D C5 ", 150)
    } else {
        for (let index = 0; index < 2; index++) {
            music.playMelody("C5 E D B D F B - ", 150)
        }
        for (let index = 0; index < 4; index++) {
            music.playMelody("C5 B A G F E D C ", 150)
            music.playMelody("C D E F G A B C5 ", 150)
        }
        for (let index = 0; index < 2; index++) {
            music.playMelody("C C C C5 C5 C C C ", 150)
        }
        music.playMelody("C C C C5 C5 C F C ", 150)
        for (let index = 0; index < 4; index++) {
            music.playMelody("E B C5 A B G A F ", 150)
        }
        music.playMelody("A F E F D G E F ", 150)
    }
})
