CREATE OR REPLACE Function fn_updateCountry(param_Id int,param_countryName varchar(35),param_isdCode varchar(30),param_currencyName varchar(30),param_currencyCode varchar(30))
 returns integer
 LANGUAGE plpgsql
 COST 100
 VOLATILE
 AS $BODY$
declare n int;
 begin
 update Country set countryName=param_countryName, isdCode=param_isdCode, currencyName=param_currencyName, currencyCode=param_currencyCode where Id=param_Id;
 return n;
 end
 $BODY$;





CREATE OR REPLACE Function fn_updateState(param_id int, param_stateName varchar(35),param_countryId int)
 returns integer
 LANGUAGE plpgsql
 COST 100
 VOLATILE
 AS $BODY$
declare n int;
 begin
 update State set  stateName=param_stateName, countryId=param_countryId where Id=param_id;
 return n;
 end
 $BODY$;



 CREATE OR REPLACE Function fn_updateCity(param_Id int,param_cityName varchar(35),param_stateId int)
 returns integer
 LANGUAGE plpgsql
 COST 100
 VOLATILE
 AS $BODY$
declare n int;
 begin
 update City set cityName=param_cityName, stateId=param_stateId where Id=param_Id;
 return n;
 end
 $BODY$;



CREATE OR REPLACE Function fn_updateArea(param_Id int ,param_areaName varchar(500),param_zipCode varchar,param_cityId int)
 returns integer
 LANGUAGE plpgsql
 COST 100
 VOLATILE
 AS $BODY$
declare n int;
 begin
 update Area set  areaName=param_areaName, zipCode=param_zipCode, cityId=param_cityId where Id=param_Id;
 return n;
 end
 $BODY$;




 CREATE OR REPLACE Function fn_updateRegistration(param_ID  int ,param_name varchar(30),param_email varchar(50),param_mobile varchar,param_address text,param_gender varchar,param_occupation varchar,param_rollId int,param_dob varchar,param_status varchar,param_gmail_id varchar,param_areaId int)
 returns integer
 LANGUAGE plpgsql
 COST 100
 VOLATILE
 AS $BODY$
declare n int;
 begin
 update Registration set  name=param_name, email=param_email, mobile=param_mobile, address=param_address, gender=param_gender, occupation=param_occupation, rollId=param_rollId, dob=param_dob, status=param_status, gmail_id=param_gmail_id, areaId=param_areaId where Id=param_ID;
 return n;
 end
 $BODY$;


 CREATE OR REPLACE Function fn_updatepropertyTypes(param_Id int ,param_propertyType varchar)
 returns integer
 LANGUAGE plpgsql
 COST 100
 VOLATILE
 AS $BODY$
declare n int;
 begin
 update propertyTypes set  propertyType=param_propertyType where Id=param_Id;
 return n;
 end
 $BODY$;


 CREATE OR REPLACE Function fn_updateFacility(param_Id int,param_facilityName varchar(50))
 returns integer
 LANGUAGE plpgsql
 COST 100
 VOLATILE
 AS $BODY$
declare n int;
 begin
 update Facility set facilityName=param_facilityName where Id=param_Id;
 return n;
 end
 $BODY$;


 CREATE OR REPLACE Function fn_updateFacilityMapping(param_Id int,param_propertyTypeId int,param_facilityId int)
 returns integer
 LANGUAGE plpgsql
 COST 100
 VOLATILE
 AS $BODY$
declare n int;
 begin
 update FacilityMapping set  propertyTypeId=param_propertyTypeId, facilityId=param_facilityId where Id=param_Id;
 return n;
 end
 $BODY$;


 CREATE OR REPLACE Function fn_updatePropertyDetails(param_Id int,param_userId int,param_propertyTypeId int,param_propertyName varchar(80),param_facing varchar,param_price bigint,param_description varchar(100),param_nearlukVerified varchar,param_status varchar,param_postedDate date,param_propertyArea bigint,param_constructionStatus varchar,param_securityDeposit bigint,param_maintainanceCost bigint,param_rentalPeriod varchar,param_communityId bigint)
 returns integer
 LANGUAGE plpgsql
 COST 100
 VOLATILE
 AS $BODY$
declare n int;
 begin
 update PropertyDetails set  userId=param_userId, propertyTypeId=param_propertyTypeId, propertyName=param_propertyName, facing=param_facing, price=param_price, description=param_description, nearlukVerified=param_nearlukVerified, status=param_status, postedDate=param_postedDate, propertyArea=param_propertyArea, constructionStatus=param_constructionStatus, securityDeposit=param_securityDeposit, maintainanceCost=param_maintainanceCost, rentalPeriod=param_rentalPeriod, communityId=param_communityId where Id=param_Id;
 return n;
 end
 $BODY$;



 CREATE OR REPLACE Function fn_updatePropertyAmenities(param_Id int,param_propertyAmenity varchar)
 returns integer
 LANGUAGE plpgsql
 COST 100
 VOLATILE
 AS $BODY$
declare n int;
 begin
 update PropertyAmenities set  propertyAmenity=param_propertyAmenity where Id=param_Id;
 return n;
 end
 $BODY$;


 CREATE OR REPLACE Function fn_updateAddPropertyAmenities(param_Id int,param_propertyId int,param_propertyAmenityId int,param_amenityValue varchar(30))
 returns integer
 LANGUAGE plpgsql
 COST 100
 VOLATILE
 AS $BODY$
declare n int;
 begin
																																				    
 update addpropertyamenities set propertyId=param_propertyId, propertyAmenityId=param_propertyAmenityId, amenityValue=param_amenityValue where Id=param_Id;
 return n;
 end
 $BODY$;


CREATE OR REPLACE Function fn_updateAmenityMapping(param_Id int,param_propertyImenityId int,param_propertyTypeId int)
 returns integer
 LANGUAGE plpgsql
 COST 100
 VOLATILE
 AS $BODY$
declare n int;
 begin
 update AmenityMapping set  propertyImenityId=param_propertyImenityId, propertyTypeId=param_propertyTypeId where Id=param_Id;
 return n;
 end
 $BODY$;
 CREATE OR REPLACE Function fn_updatePropertyAddress (param_Id int,param_propertyId int,param_addressProofType varchar(30),param_addressProofId varchar(50),param_address varchar(200),param_pincode varchar(30),param_landmarks varchar(30),param_countryId int,param_stateId int,param_cityId int,param_areaId int,param_latitude numeric,param_longitude numeric)
 returns integer
 LANGUAGE plpgsql
 COST 100
 VOLATILE
 AS $BODY$
declare n int;
 begin
 update PropertyAddress  set  propertyId=param_propertyId, addressProofType=param_addressProofType, addressProofId=param_addressProofId, address=param_address, pincode=param_pincode, landmarks=param_landmarks, countryId=param_countryId, stateId=param_stateId, cityId=param_cityId, areaId=param_areaId, latitude=param_latitude,longitude=param_longitude where Id=param_Id;
 return n;
 end
 $BODY$;
CREATE OR REPLACE Function fn_updateRating(param_Id int,param_propertyId int,param_rating int,param_userId int,param_comment varchar(24))
 returns integer
 LANGUAGE plpgsql
 COST 100
 VOLATILE
 AS $BODY$
declare n int;
 begin
 update Rating set  propertyId=param_propertyId, rating=param_rating, userId=param_userId, comment=param_comment where Id=param_Id;
 return n;
 end
 $BODY$;
CREATE OR REPLACE Function fn_updateFavourites(param_Id int,param_userId int,param_propertyId int)
 returns integer
 LANGUAGE plpgsql
 COST 100
 VOLATILE
 AS $BODY$
declare n int;
 begin
 update Favourites set  userId=param_userId, propertyId=param_propertyId where Id=param_Id;
 return n;
 end
 $BODY$;
  CREATE OR REPLACE Function fn_updateTenantNotifications(param_Id int,param_propertyId int,param_fromUserId int,param_toUserId int,param_message varchar(300),param_notifyDate date,param_notificationType varchar(30),param_status varchar(10))
 returns integer
 LANGUAGE plpgsql
 COST 100
 VOLATILE
 AS $BODY$
declare n int;
 begin
 update TenantNotifications set  propertyId=param_propertyId, fromUserId=param_fromUserId, toUserId=param_toUserId, message=param_message, notifyDate=param_notifyDate, notificationType=param_notificationType, status=param_status where Id=param_Id;
 return n;
 end
 $BODY$;
 CREATE OR REPLACE Function fn_updateAgentReview(param_Id int,param_agentUserId int,param_ownerUserId int,param_comment varchar(500),param_cmntDate date,param_rating int)
 returns integer
 LANGUAGE plpgsql
 COST 100
 VOLATILE
 AS $BODY$
declare n int;
 begin
 update AgentReview set  agentUserId=param_agentUserId, ownerUserId=param_ownerUserId, comment=param_comment, cmntDate=param_cmntDate, rating=param_rating where Id=param_Id;
 return n;
 end
 $BODY$;
 CREATE OR REPLACE Function fn_updateOwnerAgent(param_Id int,param_propertyId int,param_agentUserId int,param_status varchar(10))
 returns integer
 LANGUAGE plpgsql
 COST 100
 VOLATILE
 AS $BODY$
declare n int;
 begin
 update OwnerAgent set  propertyId=param_propertyId, agentUserId=param_agentUserId, status=param_status where Id=param_Id;
 return n;
 end
 $BODY$;
 CREATE OR REPLACE Function fn_updateBidding(param_Id int,param_userId int,param_propertyId int,param_biddingPrice bigint,param_biddingDate date)
 returns integer
 LANGUAGE plpgsql
 COST 100
 VOLATILE
 AS $BODY$
declare n int;
 begin
 update Bidding set  userId=param_userId, propertyId=param_propertyId, biddingPrice=param_biddingPrice, biddingDate=param_biddingDate where Id=param_Id;
 return n;
 end
 $BODY$;
 CREATE OR REPLACE Function fn_updateAddPropertyFacilities(param_Id int,param_propertyId int,param_facilityId int)
 returns integer
 LANGUAGE plpgsql
 COST 100
 VOLATILE
 AS $BODY$
declare n int;
 begin
 update AddPropertyFacilities set  propertyId=param_propertyId, facilityId=param_facilityId where Id=param_Id;
 return n;
 end
 $BODY$;
 CREATE OR REPLACE Function fn_updatePropertyLikes(param_Id int,param_propertyId int,param_userId int,param_likesStatus bigint)
 returns integer
 LANGUAGE plpgsql
 COST 100
 VOLATILE
 AS $BODY$
declare n int;
 begin
 update PropertyLikes set  propertyId=param_propertyId, userId=param_userId, likesStatus=param_likesStatus where Id=param_Id;
 return n;
 end
 $BODY$;
 CREATE OR REPLACE Function fn_updateGatedCommunity(param_Id int,param_communityName varchar(40),param_communityDescription varchar(200))
 returns integer
 LANGUAGE plpgsql
 COST 100
 VOLATILE
 AS $BODY$
declare n int;
 begin
 update GatedCommunity set  communityName=param_communityName, communityDescription=param_communityDescription where Id=param_Id;
 return n;
 end
 $BODY$;
 CREATE OR REPLACE Function fn_updateContactUs(param_Id int,param_name varchar(50),param_email varchar(100),param_message varchar(1000),param_postedDate varchar(30),param_status varchar(5))
 returns integer
 LANGUAGE plpgsql
 COST 100
 VOLATILE
 AS $BODY$
declare n int;
 begin
 update ContactUs set  name=param_name, email=param_email, message=param_message, postedDate=param_postedDate, status=param_status where Id=param_Id;
 return n;
 end
 $BODY$;
 CREATE OR REPLACE Function fn_updateAddPropertyFacilities(param_Id int,param_propertyId int,param_facilityId int)
 returns integer
 LANGUAGE plpgsql
 COST 100
 VOLATILE
 AS $BODY$
declare n int;
 begin
 update AddPropertyFacilities set  propertyId=param_propertyId, facilityId=param_facilityId where Id=param_Id;
 return n;
 end
 $BODY$;
 CREATE OR REPLACE Function fn_updateDomainlogs(param_Id int,param_logheader varchar(70),param_logcode varchar(70),param_logtype varchar(70),param_message varchar(70),param_loggedfor varchar(70),param_status boolean)
 returns integer
 LANGUAGE plpgsql
 COST 100
 VOLATILE
 AS $BODY$
declare n int;
 begin
 update Domainlogs set  logheader=param_logheader, logcode=param_logcode, logtype=param_logtype, message=param_message, loggedfor=param_loggedfor, status=param_status where Id=param_Id;
 return n;
 end
 $BODY$;
 CREATE OR REPLACE Function fn_updateUserLogin(param_Id int,param_session text)
 returns integer
 LANGUAGE plpgsql
 COST 100
 VOLATILE
 AS $BODY$
declare n int;
 begin
 update UserLogin set session=param_session, accessTime= current_timestamp where Id=param_Id;
 return n;
 end
 $BODY$;

CREATE OR REPLACE Function fn_updateAuthentication(param_id int,param_userid int,param_email varchar(50),param_password varchar(50),param_lastaccess timestamp with time zone,param_lastunsuccessfulaccess timestamp with time zone,param_initiallogin timestamp with time zone,param_lastmodified timestamp with time zone,param_successfullogins int,param_loginsfailed int,param_loginsfreq int,param_online varchar,param_devicetype varchar,param_accessedip text)
 returns integer
 LANGUAGE plpgsql
 COST 100
 VOLATILE
 AS $BODY$
declare n int;
 begin
 update Authentication set  userid=param_userid, email=param_email, password=param_password, lastaccess=param_lastaccess, lastunsuccessfulaccess=param_lastunsuccessfulaccess, initiallogin=param_initiallogin, lastmodified=param_lastmodified, successfullogins=param_successfullogins, loginsfailed=param_loginsfailed, loginsfreq=param_loginsfreq, online=param_online, devicetype=param_devicetype, accessedip=param_accessedip where Id=param_id;
 return n;
 end
 $BODY$;
 CREATE OR REPLACE Function fn_updatePropertyViews(param_Id int,param_propertyId int,param_userId int,param_date varchar(30))
 returns integer
 LANGUAGE plpgsql
 COST 100
 VOLATILE
 AS $BODY$
declare n int;
 begin
 update PropertyViews set userId=param_userId, date=param_date where id=param_Id;
 return n;
 end
 $BODY$;


CREATE OR REPLACE FUNCTION public.fn_updateprofile(
	param_name character varying,
	param_email character varying,
	param_mobile character varying,
	param_address text,
	param_gender character varying,
	param_dob character varying,
	param_occupation character varying,
	param_userid integer,
	param_areaid integer)
    RETURNS integer
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
AS $BODY$

declare n int;
begin
update  registration set name=param_name,email=param_email,mobile=param_mobile,address=param_address,
      gender=param_gender,dob=param_dob,occupation=param_occupation,areaid=param_areaid where id=param_userid;
return n;
end;

$BODY$;


CREATE OR REPLACE FUNCTION public.fn_addpropertylikes(
	param_propertyid integer,
	param_userid integer,
	param_likesstatus bigint)
    RETURNS character varying
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
AS $BODY$

declare n int;
 begin
 if not exists(select * from PropertyLikes where propertyId=param_propertyid and userId=param_userid) then
 insert into PropertyLikes (propertyId, userId, likesStatus) values(param_propertyId, param_userId, 1) ;
 return 'inserted successfully';
 else if exists(select * from PropertyLikes where propertyId=param_propertyid and userId=param_userid and likesStatus=0) then
 update PropertyLikes set likesStatus=1 where propertyId=param_propertyid and userId=param_userid ;
 return 'updated 1 sucessfully';
 else if exists(select * from PropertyLikes where propertyId=param_propertyid and userId=param_userid and likesStatus=1) then
 update PropertyLikes set likesStatus=0 where propertyId=param_propertyid and userId=param_userid ;
 return 'updated 0 sucessfully';
 end if;
 end if;
 end if;
 end
 
$BODY$;


CREATE OR REPLACE FUNCTION public.fn_addrating(
	param_propertyid integer,
	param_rating integer,
	param_userid integer,
	param_comment character varying)
    RETURNS character varying
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
AS $BODY$
declare n int;
 begin
if not exists(select * from rating where userid = param_userId and propertyid=param_propertyid ) then
 insert into Rating ( propertyId, rating, userId, comment) values(param_propertyId, param_rating, param_userId, param_comment) returning id into n;
  return n;
 return 'inserted successfully';
 
 else
    update rating set rating=param_rating,comment=param_comment where userid=param_userId and propertyid=param_propertyid;
																	
  return 'updated successfully';
 end if;
 end
 $BODY$;



--  agent
CREATE OR REPLACE FUNCTION public.fn_updatenotificationseen(
	notificationid integer)
    RETURNS void
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
AS $BODY$
begin 
update tenantnotifications set status='seen' where id=notificationid;
end
$BODY$;


CREATE OR REPLACE FUNCTION public.fn_tenantnotificationsupdate(
	param_updatestatus character varying,
	param_notificationid int)
    RETURNS void
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
AS $BODY$

begin 
update tenantnotifications set status=param_updatestatus where id=param_notificationid;
end

$BODY$;


CREATE OR REPLACE FUNCTION public.fn_property_details_update(
	amount bigint,
	securitydepositt bigint,
	monthlymaintainance bigint,
	descriptionn character varying,
	rentalperiodd character varying,
	propertyid integer)
    RETURNS void
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
AS $BODY$

begin 
update propertydetails set price = amount,securitydeposit=securitydepositt,maintainancecost=monthlymaintainance, description = descriptionn,rentalperiod=rentalperiodd 
WHERE id=propertyid;
end

$BODY$;


CREATE OR REPLACE FUNCTION public.fn_update_property_status(
	param_pid integer,
	
	param_propertystatus character varying,
param_postedDate date)
    RETURNS integer
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
AS $BODY$

declare n int;
 begin
 update propertydetails set status=param_propertystatus, postedDate=param_postedDate where id=param_pid;
return n;
 end
 
$BODY$;


CREATE OR REPLACE FUNCTION public.fn_updateenquiryform(
	ptype_id bigint,
	mn_price bigint,
	mx_price bigint,
	fcing character varying,
	cntry bigint,
	pstate bigint,
	pcity bigint,
	parea bigint,
	user_id integer)
    RETURNS void
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
AS $BODY$

begin
update enquiryform set propertytypeid=ptype_id,minprice=mn_price, maxprice=mx_price, facing=fcing,country=cntry,state=pstate,city=pcity,area=parea where userid=user_id;
end

$BODY$;


CREATE OR REPLACE FUNCTION public.fn_adminpropertystatusupdate(
	param_status character varying,
	propertyid integer)
    RETURNS void
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
AS $BODY$
begin
update propertydetails set status=param_status where id=propertyid;
end
$BODY$;

CREATE OR REPLACE FUNCTION public.fn_adminpropertyverified(
	propertyid integer)
    RETURNS void
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
AS $BODY$
begin
update propertydetails set nearlukverified='V' where id=propertyid;
end
$BODY$;
CREATE OR REPLACE FUNCTION public.fn_admincontactusupdate(
	param_id integer)
    RETURNS void
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
AS $BODY$
begin
update contactus set status='U' where id=param_id;
end
$BODY$;


CREATE OR REPLACE FUNCTION public.fn_update_otp_password(
user_id integer,
upassword character varying)
    RETURNS integer
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
AS $BODY$

declare n int;
 begin
update login set password=upassword where userid=user_id returning userid into n;
 return n;
 end
 

$BODY$;


CREATE OR REPLACE FUNCTION public.fn_updatecontactview(
	param_propertyid integer,
	param_userid integer)
    RETURNS integer
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
AS $BODY$
declare n int;
 begin
 update propertyviews set contactviewed='yes' where  propertyid = param_propertyid and userid= param_userid ;
 return n;
 end
 $BODY$;


   CREATE OR REPLACE FUNCTION public.fn_chatmapptimeupdate(
	room_id integer)
    RETURNS text
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
AS $BODY$

declare i text;
begin
update chatmapping set time=current_timestamp where cmsid=room_id returning cmsid into i;
return i;
end
$BODY$;