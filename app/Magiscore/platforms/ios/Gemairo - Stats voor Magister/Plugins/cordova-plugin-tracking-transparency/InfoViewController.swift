//
//  InfoViewController.swift
//  Cordova Tracking Transparency
//
//  Created by Felix Nievelstein on 11.05.21.
//

import UIKit

@available(iOS 14, *)
protocol InfoViewControllerDelegate: AnyObject {
    func onButtonPressed()
}

@available(iOS 14, *)
class InfoViewController: UIViewController, UITableViewDelegate, UITableViewDataSource {
    
    @IBOutlet weak var tableView: UITableView!
    let info: TrackingRequestInfo?
    @IBOutlet weak var button: UIButton!
    @IBOutlet weak var subText: UILabel!
    @IBOutlet weak var titleLabel: UILabel!
    @IBOutlet weak var textLabel: UILabel!
    @IBOutlet weak var tableHeightConstraint: NSLayoutConstraint!
    
    weak var delegate: InfoViewControllerDelegate?
    
    init(info: TrackingRequestInfo, nibName nibNameOrNil: String?, bundle nibBundleOrNil: Bundle?) {
        self.info = info
        super.init(nibName: nibNameOrNil, bundle: nibBundleOrNil)
    }
    
    required init?(coder: NSCoder) {
        self.info = nil
        super.init(coder: coder)
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        tableView.register(UINib(nibName: "InfoTableViewCell", bundle: nil), forCellReuseIdentifier: "infoCell")
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        if let mInfo = info {
            button.setTitle(mInfo.buttonTitle, for: .normal)
            titleLabel.text = mInfo.title
            subText.text = mInfo.subText
            textLabel.text = mInfo.text
            view.backgroundColor = mInfo.primaryColor
            titleLabel.textColor = mInfo.onPrimaryColor
            textLabel.textColor = mInfo.onPrimaryColor
            subText.textColor = mInfo.onPrimaryColor
            button.backgroundColor = mInfo.secondaryColor
            button.tintColor = mInfo.onSecondaryColor
            button.layer.cornerRadius = 8
        }
        
        
    }
    
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        tableView.reloadData()
        tableView.layoutIfNeeded()
        tableHeightConstraint.constant = tableView.contentSize.height
    }
    
    func numberOfSections(in tableView: UITableView) -> Int {
        1
    }
    
    @IBAction func onButtonPressed(_ sender: Any) {
        delegate?.onButtonPressed()
    }
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        info != nil ? info!.reasons.count : 0
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "infoCell") as! InfoTableViewCell
        cell.titleLabel.text = info!.reasons[indexPath.row].text
        cell.titleLabel.textColor = info!.onPrimaryColor
        cell.reasonImageView.image = info!.reasons[indexPath.row].image
        cell.reasonImageView.tintColor = info!.onPrimaryColor
        return cell
    }
}

