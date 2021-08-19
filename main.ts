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
                if (tiles.locationXY(tiles.locationInDirection(tiles.locationOfSprite(char), char_button_direction), tiles.XY.row) >= 10) {
                    tiles.setTileAt(tiles.locationInDirection(tiles.locationOfSprite(char), char_button_direction), assets.tile`tile6`)
                } else {
                    tiles.setTileAt(tiles.locationInDirection(tiles.locationOfSprite(char), char_button_direction), assets.tile`tile2`)
                }
                tiles.setWallAt(tiles.locationInDirection(tiles.locationOfSprite(char), char_button_direction), false)
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
    char_speed_max = 150
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
    for (let col = 0; col <= 99; col++) {
        for (let row = 0; row <= 99; row++) {
            if (row > 10) {
                if (Math.percentChance(50)) {
                    tiles.setTileAt(tiles.getTileLocation(col, row), assets.tile`stone`)
                    tiles.setWallAt(tiles.getTileLocation(col, row), true)
                } else {
                    tiles.setTileAt(tiles.getTileLocation(col, row), assets.tile`ruby ore`)
                    tiles.setWallAt(tiles.getTileLocation(col, row), true)
                }
            } else {
                if (row == 10) {
                    tiles.setTileAt(tiles.getTileLocation(col, row), sprites.castle.tilePath2)
                    tiles.setWallAt(tiles.getTileLocation(col, row), true)
                }
            }
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
}
controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
    if (tool_active == "hammer" && controller.A.isPressed()) {
        if (grid.spriteRow(selected_block) - tiles.locationXY(tiles.locationOfSprite(char), tiles.XY.row) < 3) {
            grid.move(selected_block, 0, 1)
        }
    }
})
let char_speed_jump = 0
let char_speed_decel_rate = 0
let char_speed_rate = 0
let char_speed_max = 0
let buildable_blocks: Image[] = []
let tool_active = ""
let char_button_direction = 0
let char: Sprite = null
let selected_block: Sprite = null
setupVariables()
tiles.setTilemap(tilemap`level1`)
char = sprites.create(img`
    . . . . f f f f . . . . 
    . . f f f 2 2 f f f . . 
    . f f f 2 2 2 2 f f f . 
    f f f e e e e e e f f f 
    f f e 2 2 2 2 2 2 e e f 
    f e 2 f f f f f f 2 e f 
    f f f f e e e e f f f f 
    f e f b f 4 4 f b f e f 
    e e 4 1 f d d f 1 4 e e 
    f e e d d d d d d e e f 
    . f e e 4 4 4 4 e e f . 
    e 4 f 2 2 2 2 2 2 f 4 e 
    4 d f 2 2 2 2 2 2 f d 4 
    4 4 f 4 4 5 5 4 4 f 4 4 
    . . . f f f f f f . . . 
    . . . f f . . f f . . . 
    `, SpriteKind.Player)
char.ay = 250
char_button_direction = -1
generateWorld()
setupBuildables()
scene.cameraFollowSprite(char)
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
game.onUpdateInterval(200, function () {
	
})
