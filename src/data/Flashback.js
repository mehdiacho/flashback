export class Flashback {
    /**
     * Constructs a new Flashback instance.
     * 
     * @param {string} id - The unique identifier for the Flashback.
     * @param {string} title - The title of the Flashback.
     * @param {string} description - A brief description of the Flashback.
     * @param {Map<string, string>} owner - A map of user IDs to their display names participating in the Flashback.
     * @param {Map<string, string>} participants - A map of user IDs to their display names participating in the Flashback.
     * @param {Date} createdAt - The date and time when the Flashback was created.
     * @param {Date} updatedAt - The date and time when the Flashback was last updated.
     * @param {string} viewMode - The view mode of the Flashback, indicating how it should be displayed.
     * @param {string} image - The URL of the image associated with the Flashback.
     */
    constructor(id, title, description, owner, participants, createdAt, updatedAt, viewMode, image) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.owner = owner;
        this.participants = participants;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.viewMode = viewMode;
        this.image = image;
    }

    /**
     * Creates a new Flashback instance from a JSON object.
     * @param {object} json - The JSON object to create the Flashback from.
     * @returns {Flashback} - The new Flashback instance.
     */
    static fromJson(json) {
        return new Flashback(json.id, json.title, json.description, json.owner, json.participants, json.createdAt, json.updatedAt, json.viewMode, json.image);
    }

    /**
     * Getter for the ID of the Flashback.
     * @returns {string} - The ID of the Flashback.
     */
    get id() {
        return this._id;
    }

    /**
     * Setter for the ID of the Flashback.
     * @param {string} id - The new ID for the Flashback.
     */
    set id(id) {
        this._id = id;
    }

    /**
     * Getter for the title of the Flashback.
     * @returns {string} - The title of the Flashback.
     */
    get title() {
        return this._title;
    }

    /**
     * Setter for the title of the Flashback.
     * @param {string} title - The new title for the Flashback.
     */
    set title(title) {
        this._title = title;
    }

    /**
     * Getter for the description of the Flashback.
     * @returns {string} - The description of the Flashback.
     */
    get description() {
        return this._description;
    }

    /**
     * Setter for the description of the Flashback.
     * @param {string} description - The new description for the Flashback.
     */
    set description(description) {
        this._description = description;
    }

    /**
     * Getter for the owner ID of the Flashback.
     * @returns {string} - The owner ID of the Flashback.
     */
    get owner() {
        return this._owner;
    }

    /**
     * Setter for the owner ID of the Flashback.
     * @param {string} owner - The new owner ID for the Flashback.
     */
    set owner(owner) {
        this._owner = owner;
    }

    /**
     * Getter for the participants of the Flashback.
     * @returns {Array} - The participants of the Flashback.
     */
    get participants() {
        return this._participants;
    }

    /**
     * Setter for the participants of the Flashback.
     * @param {Array} participants - The new participants for the Flashback.
     */
    set participants(participants) {
        this._participants = participants;
    }

    /**
     * Getter for the creation date of the Flashback.
     * @returns {Date} - The creation date of the Flashback.
     */
    get createdAt() {
        return this._createdAt;
    }

    /**
     * Setter for the creation date of the Flashback.
     * @param {Date} createdAt - The new creation date for the Flashback.
     */
    set createdAt(createdAt) {
        this._createdAt = createdAt;
    }

    /**
     * Getter for the update date of the Flashback.
     * @returns {Date} - The update date of the Flashback.
     */
    get updatedAt() {
        return this._updatedAt;
    }

    /**
     * Setter for the update date of the Flashback.
     * @param {Date} updatedAt - The new update date for the Flashback.
     */
    set updatedAt(updatedAt) {
        this._updatedAt = updatedAt;
    }

    /**
     * Getter for the view mode of the Flashback.
     * @returns {string} - The view mode of the Flashback.
     */
    get viewMode() {
        return this._viewMode;
    }

    /**
     * Setter for the view mode of the Flashback.
     * @param {string} viewMode - The new view mode for the Flashback.
     */
    set viewMode(viewMode) {
        this._viewMode = viewMode;
    }

    /**
     * Getter for the image of the Flashback.
     * @returns {string} - The image URL of the Flashback.
     */
    get image() {
        return this._image;
    }

    /**
     * Setter for the image of the Flashback.
     * @param {string} image - The new image URL for the Flashback.
     */
    set image(image) {
        this._image = image;
    }
}

export default Flashback;