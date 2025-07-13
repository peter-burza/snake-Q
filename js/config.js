export const BLOCK_SIZE = 15
export const GAMEFIELD_WIDTH = 25
export const GAMEFIELD_HEIGHT = 15
export const STARTING_BODY_LENGTH = 2
export const GAME_MODE = 'infinite'
export const CREATURE_TYPES = { snake: 0, bug: 1 }
export const CONTROL_BUTTONS = [
    { id: "WASD", buttons: ['KeyW', 'KeyS', 'KeyA', 'KeyD'] },
    { id: "Arrows", buttons: ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'] },
    { id: "8456", buttons: ['Numpad8', 'Numpad5', 'Numpad4', 'Numpad6'] },
    { id: "IJKL", buttons: ['KeyI', 'KeyK', 'KeyJ', 'KeyL'] }
]
export const SNAKE_COLORS = [
    ["#228B22", "#32CD32"], // Forest Floor
    ["#964B00", "#A86D1F"], // Mocha
    ["#3E8E41", "#5C9F5C"], // Olive Green
    ["#A0522D", "#C68C53"], // Sienna
    ["#635787", "#7A7F9A"], // Umber
    ["#452B1F", "#5C3B2F"], // Earthy Brown
    ["#2F3E2A", "#3F4F3F"], // Forest Floor
    ["#452D25", "#5C402F"], // Dark Clay
    ["#663300", "#7F4C1F"], // Earthy Red
    ["#2F5D34", "#3E7B45"], // Dark Moss
]
export const SNAKE_NAMES = [
    "Ashley", "Michael", "Brittany", "Christopher", "Jessica", "Matthew", "Tiffany", "Joshua", "Amanda", "Nicholas", "Samantha", "Andrew", "Megan", "Tyler", "Elizabeth", "Brandon", "Stephanie", "Ryan", "Rachel", "Eric", "Nicole", "Brian", "Heather", "Kevin", "Lauren", "Steven", "Courtney", "Robert", "Amber", "William", "Melissa", "James", "Sarah", "Joseph", "Emily", "Daniel", "Christina", "Benjamin", "Danielle", "Alexander", "Kristin", "Austin", "Jamie", "Cody", "Katie", "Dylan", "Lindsey", "Ethan", "Michelle", "Lucas", "Tanya", "Tony", "Shannon", "Vincent", "Crystal", "Frankie", "Jenna", "Johnny", "Alyssa", "Jimmy", "Taylor", "Timmy", "Morgan", "Tommy", "Holly", "Ronnie", "Kelly", "Bobby", "Jenny", "Ricky", "Lisa", "Tonya", "Tracy", "Stacy", "Wendy"
]