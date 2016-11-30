
import java.awt.Dimension;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;

import javax.swing.JButton;
import javax.swing.JFileChooser;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JTextField;

import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.bson.Document;

import com.mongodb.MongoClient;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;

public class UpdateDatabase extends JPanel{
	private static final long serialVersionUID = 1L;
	
	public static final	String dataBaseIP = "localhost";
	public static final int dataBasePort = 27017;
	public static final	String dataBaseName = "greaterenergy";
	public static final String dataBaseCollection = "products";
	
	public static final int PART = 0;
	public static final int NAME = 1;
	public static final int WATT = 2;
	public static final int MSRP = 3;
	public static final int COST = 4;
	
	public static final int STARTINGROW = 7;
	
	private static String currentCategory = "";
	private static MongoClient mongoclient;
	private static MongoDatabase database;
	private static MongoCollection<Document> collection;
	private static File inputFile;
	
	private static JFrame frame;
	private static JPanel pleaseWait;
	private static UpdateDatabase main;
	private static JTextField DBName, DBCollection, DBIP, DBPort, filename;
	private static JButton select, update;
	
	public static void main(String[] args){
		frame = new JFrame("Database Updater");
		main = new UpdateDatabase();
		frame.add(main);
		frame.setResizable(false);
		frame.pack();
		frame.setLocationRelativeTo(null);
		frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		frame.setVisible(true);
	}
	
	public UpdateDatabase(){
		setPreferredSize(new Dimension(200,300));
		DBIP = new JTextField(16);
		DBIP.setText("localhost");
		this.add(new JLabel("IP Address :"));
		this.add(DBIP);
		DBPort = new JTextField(16);
		DBPort.setText("27017");
		this.add(new JLabel("Port :"));
		this.add(DBPort);
		DBName = new JTextField(16);
		DBName.setText("greaterenergy");
		this.add(new JLabel("Database :"));
		this.add(DBName);
		DBCollection = new JTextField(16);
		DBCollection.setText("products");
		this.add(new JLabel("Collection :"));
		this.add(DBCollection);
		filename = new JTextField(16);
		filename.setEditable(false);
		filename.setText("not selected");
		this.add(new JLabel("Product File :"));
		this.add(filename);
		select = new JButton("Select File");
		select.addActionListener(e -> chooseFile());
		this.add(select);
		update = new JButton("Update Database");
		update.addActionListener(e -> updateDB());
		this.add(update);
		

		pleaseWait = new JPanel();
		pleaseWait.setPreferredSize(new Dimension(100,50));
		pleaseWait.add(new JLabel("Updating, please wait.."));
	}
	
	private static void chooseFile(){
		JFileChooser fc = new JFileChooser();
		fc.showOpenDialog(fc);
		inputFile = fc.getSelectedFile();
		filename.setText(inputFile.getName());
	}
	private static void updateDB(){
		pleaseWait();
		
		//Select document
		if(inputFile == null){
			mainWindow();
			return;
		}
		
		//Setup Excel and Database vars
		Workbook workbook = null;
		Sheet sheet;
		mongoclient = new MongoClient(dataBaseIP, dataBasePort);
		database = mongoclient.getDatabase(dataBaseName);
		collection = database.getCollection(dataBaseCollection);
		
		//Loop through excel and update the database
		try{
			workbook = new XSSFWorkbook(new FileInputStream(inputFile));
			sheet = workbook.getSheetAt(0);
			int row = STARTINGROW;
			while(true){
			String[] thisRow = new String[5];
				Row r = sheet.getRow(row);
				thisRow[PART] = (r.getCell(PART).toString());
				thisRow[NAME] = (r.getCell(NAME).toString());
				thisRow[WATT] = (r.getCell(WATT).toString());
				thisRow[MSRP] = (r.getCell(MSRP).toString());
				thisRow[COST] = (r.getCell(COST).toString());
				//Ignore lines with no part number
				if(thisRow[PART] != ""){
					//If the product exists, update it
					Document filter = new Document("name", thisRow[NAME]);
					if(count(collection.find(filter)) != 0){
						Document insert = new Document("$set", new Document("price", thisRow[MSRP]));
						collection.findOneAndUpdate(filter, insert);
					}
					else{
						Document insert = new Document("name", thisRow[NAME]);
						insert.append("partID", thisRow[PART]);
						insert.append("category", currentCategory);
						insert.append("description", "");
						insert.append("price", thisRow[MSRP]);
						insert.append("", thisRow[PART]);
						collection.insertOne(insert);
					}
				}
				//Keep track of the categories
				if(thisRow[PART] == ""){
					if(thisRow[NAME]!= ""){
						currentCategory = thisRow[NAME];
					}
				}
				row++;
			}
		}catch (Exception e) {
			try {
				workbook.close();
			} catch (IOException e1) {
				e1.printStackTrace();
			}
		}
		//Close database Connection
		mongoclient.close();
		JOptionPane.showMessageDialog(null, "Successfully Updated Database");
		mainWindow();
	}
	
	private static void pleaseWait(){
		frame.setVisible(false);
		frame.remove(main);
		frame.add(pleaseWait);
		frame.pack();
		frame.setLocationRelativeTo(null);
		frame.setVisible(true);
	}
	
	private static void mainWindow(){
		frame.setVisible(false);
		frame.remove(pleaseWait);
		frame.add(main);
		frame.pack();
		frame.setLocationRelativeTo(null);
		frame.setVisible(true);
	}

	private static int count(FindIterable<Document> find) {
		int amount = 0;
		for(@SuppressWarnings("unused") Document d : find){
			amount++;
		}
		return amount;
	}
}
