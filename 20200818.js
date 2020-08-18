package modules;

import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.CacheLookup;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.How;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.LoadableComponent;
import org.openqa.selenium.support.ui.WebDriverWait;
import tools.WebDriverService;
import tools.WebElementUtils;

import static org.testng.Assert.*;

public class AddMembersDialogModule extends LoadableComponent<AddMembersDialogModule> {

    // Page info
    public static final String MODULE_TITLE = "Add User";
    public static final String HEADERXPATH = "//span[@class='x-window-header-text' and text()='" + MODULE_TITLE + "']";

    // Page Elements
    public enum LicenseType {
        VISUALISATION {public WebElement get() {
            return WebElementUtils.findElement(new By.ByXPath("//div[contains(@class, 'x-combo-list-item') and text()='Visualization']"));}
        },
        COLLABORATION {public WebElement get() {
            return WebElementUtils.findElement(new By.ByXPath("//div[contains(@class, 'x-combo-list-item') and text()='Collaboration']"));}
        },
        NOT_LICENSED {public WebElement get() {
            return WebElementUtils.findElement(new By.ByXPath("//div[contains(@class, 'x-combo-list-item') and text()='Not licensed']"));}
        };
        public abstract WebElement get();
    };
    private final String countryOption = "//div[contains(@class, 'apd-userform-country-combo-')]";
    private final String timezoneOption = "//div[contains(@class, 'item-timezone-title')]";

    @FindBy(how = How.XPATH, using = HEADERXPATH)
    @CacheLookup
    private WebElement header;
    @FindBy(how = How.XPATH, using = "//span[text()='" + MODULE_TITLE + "']/../div[contains(@class,'x-tool-close')]")
    @CacheLookup
    private WebElement closeicon;
    @FindBy(how = How.XPATH, using = "//span[text()='Member Info']")
    @CacheLookup
    private WebElement memberinfotab;
    @FindBy(how = How.XPATH, using = "//span[text()='Admin Info']")
    @CacheLookup
    private WebElement admininfotab;
    @FindBy(how = How.XPATH, using = "//input[@type='text' and @name='firstName']")
    @CacheLookup
    private WebElement firstnamefield;
    @FindBy(how = How.XPATH, using = "//input[@type='text' and @name='lastName']")
    @CacheLookup
    private WebElement lastnamefield;
    @FindBy(how = How.XPATH, using = "//input[@type='text' and @name='shortname']")
    @CacheLookup
    private WebElement memberidfield;
    @FindBy(how = How.XPATH, using = "//input[@type='password' and @name='password']")
    @CacheLookup
    private WebElement passwordfield;
    @FindBy(how = How.XPATH, using = "//input[contains(@class,'passwordconfirm') and @type='password']")
    @CacheLookup
    private WebElement passwordconfirmfield;
    @FindBy(how = How.XPATH, using = "//input[@type='text' and @name='emailAddress']")
    @CacheLookup
    private WebElement emailfield;
    @FindBy(how = How.XPATH, using = "//input[@type='text' and @name='licensetype']")
    @CacheLookup
    private WebElement licensetypefield;
    @FindBy(how = How.XPATH, using = "//input[@type='text' and contains(@class,'ymt-addedituserdialog-countryfiled')]")
    @CacheLookup
    private WebElement countryregionfield;
    @FindBy(how = How.XPATH, using = "//input[@type='text' and contains(@class,'ymt-addedituserdialog-timezone')]")
    @CacheLookup
    private WebElement timezonefield;
    @FindBy(how = How.XPATH, using = "//button[@type='button' and text()='Save']")
    @CacheLookup
    private WebElement savebutton;

    // Constructor
    public AddMembersDialogModule() {
        this.get();
    }

    // Standard methods
    protected void load() {
        PageFactory.initElements(WebDriverService.getDriver(), this);
    }

    public void isLoaded()
            throws Error {
        String actualTitle = null;
        try {
            if (header.isDisplayed()) {
                actualTitle = header.getText();
            }
        } catch (Exception e) {
            throw new Error();
        }
        assertEquals(actualTitle, MODULE_TITLE, "Not on the " + MODULE_TITLE + " dialog.");
    }

    // Functional methods
    // Fill the minimal set of fields for a Member
    public void fillMemberFieldsMin(String name, String shortName, String password) {
        load();
        fillMemberFieldsReq(name, name, shortName, password, "Russian Federation", "Russian Federation OMST",
                "qa+" + name + "@issart.com", LicenseType.VISUALISATION);
    }

    // Fill a set of the required fields for a Member
    public void fillMemberFieldsReq(String firstName, String lastName, String shortName, String password, String country,
                                    String timeZone, String eMail, LicenseType licenseType) {
        load();
        switchToMemberInfoTab();
        firstnamefield.clear();
        firstnamefield.sendKeys(firstName);
        lastnamefield.clear();
        lastnamefield.sendKeys(lastName);
        memberidfield.clear();
        memberidfield.sendKeys(shortName);
        passwordfield.clear();
        passwordfield.sendKeys(password);
        passwordconfirmfield.clear();
        passwordconfirmfield.sendKeys(password);
        emailfield.clear();
        emailfield.sendKeys(eMail);
        selectCountryRegionDropdown(country);
        selectTimeZoneDropdown(timeZone);
        switchToAdminInfoTab();
        selectLicenseTypeDropdown(licenseType.get());
    }

    // Commit changes
    public void saveChanges_success() {
        load();
        savebutton.click();
        try {
            new WebDriverWait(WebDriverService.getDriver(), 30).until(ExpectedConditions.invisibilityOfElementLocated(By.xpath(HEADERXPATH)));
        }
        catch (Exception e) {
            assertTrue(WebDriverService.getDriver().findElements(By.xpath(HEADERXPATH)).isEmpty(), "Changes in " + MODULE_TITLE + " dialog are not saved");
        }
    }

    public void saveChanges_fail() {
        load();
        savebutton.click();
        try {
            new WebDriverWait(WebDriverService.getDriver(), 30).until(ExpectedConditions.invisibilityOfElementLocated(By.xpath(HEADERXPATH)));
        }
        catch (Exception e) {
            assertFalse(WebDriverService.getDriver().findElements(By.xpath(HEADERXPATH)).isEmpty(), "There is no error upon saving of " + MODULE_TITLE + " dialog");
        }
    }

    // Set a License type
    // to use this method, switchToAdminInfoTab() must be called before at least once !
    public void selectLicenseTypeDropdown(WebElement licenseType) {
        load();
        switchToAdminInfoTab();
        licensetypefield.click();
        licenseType.click();
    }

    // Set a country/region
    public void selectCountryRegionDropdown(String CountryRegion) {
        load();
        switchToMemberInfoTab();
        countryregionfield.click();
        countryregionfield.clear();
        countryregionfield.sendKeys(CountryRegion);
        WebElementUtils.findElement(new By.ByXPath(countryOption.substring(0, countryOption.length() - 1) +
                " and text()='" + CountryRegion + "']")).click();
    }

    // Set a timezone
    public void selectTimeZoneDropdown(String TimeZone) {
        load();
        switchToMemberInfoTab();
        timezonefield.click();
        timezonefield.clear();
        timezonefield.sendKeys(TimeZone);
        WebElementUtils.findElement(new By.ByXPath(timezoneOption.substring(0, timezoneOption.length() - 1) +
                " and text()='" + TimeZone + "']")).click();
    }

    // Switch to `Admin Info` tab
    public void switchToAdminInfoTab() {
        load();
        admininfotab.click();
    }

    // Switch to `Member Info` tab
    public void switchToMemberInfoTab() {
        load();
        memberinfotab.click();
    }

    // Close method
    public void closeDialog() {
        load();
        closeicon.click();
        try {
            new WebDriverWait(WebDriverService.getDriver(), 30).until(ExpectedConditions.invisibilityOfElementLocated(By.xpath(HEADERXPATH)));
        }
        catch (Exception e) {
            assertTrue(WebDriverService.getDriver().findElements(By.xpath(HEADERXPATH)).isEmpty(), MODULE_TITLE + " dialog is not closed");
        }
    }
}
