//
//  InfoTableViewCell.swift
//  Cordova Tracking Transparency
//
//  Created by Felix Nievelstein on 11.05.21.
//

import UIKit

class InfoTableViewCell: UITableViewCell {

    @IBOutlet weak var reasonImageView: UIImageView!
    @IBOutlet weak var titleLabel: UILabel!
    
    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
    }

    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)

        // Configure the view for the selected state
    }

}
